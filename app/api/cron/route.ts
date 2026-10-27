import { NextRequest } from "next/server";
import { getCategories } from "@/lib/rag";
export async function GET(request: NextRequest) {
    try{
        const categories = await getCategories();
        console.log('Cron executed successfully');
        console.log('Categories API response:', categories);
        return new Response(`No of categories are: ${categories.length}`, { status: 200 });
    }
    catch (error: any) {
        console.error('Categories API error:', error);
        console.error('Cron execution failed');
        return new Response('Cron job execution failed', { status: 500 });
    }
}