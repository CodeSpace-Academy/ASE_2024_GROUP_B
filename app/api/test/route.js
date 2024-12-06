export async function GET(req) {
    console.log("Test route hit");
    return new Response(JSON.stringify({ message: 'Test route is working!' }), { status: 200 });
  }