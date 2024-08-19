import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import { signinInput, signupInput } from '@anonymousfpp/medium-common';
export const userRoute = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    };
}>();

userRoute.post('/signup', async (c) => {   
  const body = await c.req.json();
  const response = signupInput.safeParse(body);
  if(!response){
    c.status(411)    
    return c.text('Invalid Credentials');
  }
  
  const prisma = new PrismaClient({
    datasources: { db: { url: c.env.DATABASE_URL } },
  }).$extends(withAccelerate());

  try{
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name: body.name
      },
    });
    
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  
    return c.json({
      jwt: token,
    });
  }
  catch(e){
    c.status(403)
    return c.text(`Invalid Credentials ${e}`);
  }
});
  
  
userRoute.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
      const user = await c.req.json();
      const success = signinInput.safeParse(user);
      if(!success){
        c.status(403)
        return c.text('Invalid Credentials my new  data');
      }
      
      const response = await prisma.user.findFirst({
        where:{
          username : user.username,
          password: user.password,
        }
      })
    
      if(!response){
        c.status(403)
        return c.text('Invalid Credentials');
      }
    
      const jwtKey = await sign({id: response.id}, c.env.JWT_SECRET);
      return c.json({
        jwt: jwtKey
      });
    }
    catch(e){
      console.log(e);
      return c.status(403);
    }
})  