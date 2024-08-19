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


blogRoute.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
        if (user) {
            c.set("userId", user.id);
            await next();
        } else {
            c.status(403);
            return c.json({
                message: "You are not logged in"
            })
        }
    } catch(e) {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
});


blogRoute.post('/', async (c) => {
    try{
        console.log("hhiii");
        
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

        console.log("my response is ", response);

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

        console.log(id);
        console.log(isNaN(Number(id)));
        

        if (!id || isNaN(Number(id))) {
            return c.json({
                message: 'Invalid or missing id parameter. Please provide a valid numeric ID.'
            }, 400);
        }
        
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
            // c.status(404);
            return c.json({
                message: 'Blog not found'
            }, 404)
        }

        return c.json({
            response
        })
    }
    catch(e){
        console.log(e);
        // c.status(500);
        return c.json({
            message: `Error found in that segment ${e.message}`,
        }, 500)
    }
})