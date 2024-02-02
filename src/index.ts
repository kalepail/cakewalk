import { scValToNative } from '@stellar/stellar-sdk'
import { Contract } from 'cakewalk-sdk'

const contract = new Contract({
    contractId: 'CB4W5563H62YDM27BK5AVBYVPTFXHRPPMCYIMYHT3CWITCZSY34IO2RJ',
    networkPassphrase: 'Test SDF Future Network ; October 2022',
    rpcUrl: 'https://rpc-futurenet.stellar.org',
})

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	CAKEWALK_NFTS: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		let html = `
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Cakewalk</title>
			<style>
				body {
					background: black;
					color: white;
				}
				div {
					display: flex; 
					flex-wrap: wrap;
				}
				pre {
					margin: 0.5rem;
					max-width: calc((100vw / 5) - (4 * 1rem));
					min-width: 250px;
					overflow: hidden;
				}
				code {
					display: block;
				}
			</style>
		</head>
		<body>
		<div>`

		const url = new URL(request.url)

		if (url.pathname.includes('favicon'))
			return new Response(null, { status: 404 })

		let list: Map<number, string> | null = null

		try {
			await contract.getList().then(({ result }) => list = result)
			await env.CAKEWALK_NFTS.put('meta:list', JSON.stringify(list))	
		} catch {
			list = await env.CAKEWALK_NFTS.get('meta:list', { type: 'json' })
		}

		if (list) {
			const promises = []

			for (const item of list) {
				const promise = new Promise(async (resolve, reject) => {
					try {
						const [index, name] = item
						let canvas = await env.CAKEWALK_NFTS.get(`nft:${index}:${name}`, { type: 'text' })
	
						if (!canvas) {
							const res = await contract.getPicture({ picture: index })
							const val = scValToNative(res.simulationData.result.retval)
	
							canvas = val.canvas
	
							await env.CAKEWALK_NFTS.put(`nft:${index}:${name}`, val.canvas)
						}

						if (canvas)
							html += `<pre style="order: ${index};"><code>
								${canvas.replace(/\n$/, ` ${name}`)}
							</code></pre>`
	
						resolve(null)
					}
	
					catch(err) {
						reject(err)
					}
				})

				promises.push(promise)
			}

			await Promise.allSettled(promises)
		}

		html += `</div></body></html>`

        return new Response(html, {
			headers: {
				'content-type': 'text/html; charset=UTF-8',
				'cache-control': 'public, max-age=30, immutable',
			}
		})
	},
};
