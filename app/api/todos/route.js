import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import {PrismaClient} from '@prisma/client';
import  redisClient  from '../../redisclient'

const prisma = new PrismaClient();
async function getCurrentUser() {
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  return user
}

export async function GET(request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Try to get from cache first
    const cacheKey = `todos:${user.id}`
    const cachedTodos = await redisClient.get(cacheKey)
    
    if (cachedTodos) {
      return NextResponse.json(JSON.parse(cachedTodos))
    }

    // Fetch from database
    const todos = await prisma.todos.findMany({
      where: { authorid: user.id },
      orderBy: { id : 'desc' }
    })

    // Cache the result for 5 minutes
    await redisClient.setEx(cacheKey, 300, JSON.stringify(todos))

    return NextResponse.json(todos)
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { topic, description } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: 'topic is required' },
        { status: 400 }
      )
    }

    const todo = await prisma.todos.create({
      data: {
        topic,
        description,
        authorid: user.id,
      }
    })

    // Invalidate cache
    const cacheKey = `todos:${user.id}`
    await redisClient.del(cacheKey)

    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    console.error('Error creating todo:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}