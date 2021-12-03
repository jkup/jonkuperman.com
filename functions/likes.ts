export const onRequest: PagesFunction<{
  COUNTER: DurableObjectNamespace
}> = async ({ request, env }) => {
  try {
    // Generate unique DO for each path
    let data: any = await request.json()
    let path = data.body.path
    let operation = data.body.operation || "/"

    let id = env.COUNTER.idFromName(path)
    let obj = env.COUNTER.get(id)

    let resp = await obj.fetch(request.url, {
      method: "POST",
      body: JSON.stringify({
        url: request.url,
        path: path,
        operation: operation,
      }),
    })

    let count = await resp.text()

    return new Response(count)
  } catch (e) {
    console.error(e)
    return new Response(e.message, { status: 500 })
  }
}
