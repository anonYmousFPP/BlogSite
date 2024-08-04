import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';
import { createBlogInput, updateBlogInput } from '@anonymousfpp/medium-common';

export const blogRoute = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    },
    Variables: {
        userId: string,
    }
}>();

blogRoute.use('/*', async(c, next) => {
    const header = c.req.header("authorization") || "";

    const response = await verify(header, c.env.JWT_SECRET);
    if(response && typeof response.id === 'string'){
        c.set("userId", response.id);
        await next();
    }
    else{
        c.status(403)
        return c.json({error: "unauthorized"})
    }
})


blogRoute.post('/', async (c) => {
    try{
        const prisma = new PrismaClient({
            datasources: { db: { url: c.env.DATABASE_URL } },
        }).$extends(withAccelerate());
        
        const authorId = c.get("userId");
        const body = await c.req.json();
        const success = createBlogInput.safeParse(body);
        if(!success){
            c.status(403)
            return c.text('Invalid Credentials');
        }

        const response = await prisma.blog.create({
            data:{
                title: body.title,
                content: body.content,
                authorId : Number(authorId),
            }
        })

        if(!response){
            c.status(404);
            return c.json({
                message: 'Error found in that segment'
            })
        }
        return c.json({
            id: response.id
        })
    }
    catch(e){
        console.log(e);
        c.status(404);
        return c.json({
            message: 'Error found in that segment'
        })
    }
  })


blogRoute.put('/', async (c) => {
    try{
        const prisma = new PrismaClient({
            datasources: { db: { url: c.env.DATABASE_URL } },
        }).$extends(withAccelerate());

        const body = await c.req.json();
        const success = updateBlogInput.safeParse(body);
        if(!success){
            c.status(403)
            return c.text('Invalid Credentials');
        }
        const response = await prisma.blog.update({
            where : {
                id: body.id
            },
            data:{
                title: body.title,
                content: body.content
            }
        })

        if(!response){
            c.status(404);
            return c.json({
                message: 'Error found in that segment'
            })
        }
        return c.json({
            response
        })
    }
    catch(e){
        console.log(e);
        c.status(404);
        return c.json({
            message: 'Error found in that segment'
        })
    }
})

blogRoute.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blogs = await prisma.blog.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });

    return c.json({
        blogs
    })
  })
  
  

  
blogRoute.get('/:id', async (c) => {
    try{
        const prisma = new PrismaClient({
            datasources: { db: { url: c.env.DATABASE_URL } },
        }).$extends(withAccelerate());

        const id = c.req.param('id');
        const response = await prisma.blog.findFirst({
            where : {
                id: Number(id)
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }

        })

        if(!response){
            c.status(404);
            return c.json({
                message: 'Error found in that segment'
            })
        }
        return c.json({
            response
        })
    }
    catch(e){
        console.log(e);
        c.status(404);
        return c.json({
            message: `Error found in that segment ${e}`,
        })
    }
})