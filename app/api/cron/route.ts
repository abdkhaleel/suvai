import { NextRequest } from "next/server";
import { getCategories } from "@/lib/rag";
export async function GET(request: NextRequest) {
    try{
        const categories = await getCategories();
        console.log('Categories API response:', categories);
        console.log('Cron executed successfully');
        return new Response('Cron job executed successfully', { status: 200 });
    }
    catch (error: any) {
        console.error('Categories API error:', error);
        console.error('Cron execution failed');
        return new Response('Cron job execution failed', { status: 500 });
    }
}