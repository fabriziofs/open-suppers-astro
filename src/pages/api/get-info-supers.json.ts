import type {APIContext} from "astro";
import {googleClient} from "../../lib/googleClient.ts";

export async function GET({request}: APIContext) {
    const url = new URL(request.url);
    const ids = url.searchParams.getAll('ids[]');
    if (!ids.length) {
        return new Response(JSON.stringify({'error': 'Invalid super ids'}), {
            status: 500, headers: {'content-type': 'application/json'}
        });
    }

    const responsesJSON = await googleClient.searchAll(ids);

    return new Response(JSON.stringify(responsesJSON), {
        status: 200,
        headers: {'content-type': 'application/json'},
    });
}