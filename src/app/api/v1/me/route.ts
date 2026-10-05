import { authenticate } from "@/lib/api";
import { userDto } from "@/lib/dto";

export async function GET(request: Request) {
    const auth = await authenticate(request);
    if (!auth.ok) return auth.response;
    return Response.json({ user: userDto(auth.user) });
}
