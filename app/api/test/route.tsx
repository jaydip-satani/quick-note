import { NextResponse } from 'next/server';
import dbConnect from '@/middleware/connect';

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({ message: 'Successfully connected to MongoDB!' }, { status: 200 });
    } catch (error) {
        console.error('Connection error:', error);
        return NextResponse.json({ message: 'Failed to connect to MongoDB!', error: error }, { status: 500 });
    }
}
