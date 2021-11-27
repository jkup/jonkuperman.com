export class DurableObjectExample {
  constructor(state, env) {
    this.state = state
    this.state.blockConcurrencyWhile(async () => {
      let stored = await this.state.storage.get("likes")
      this.likes = stored || 0
    })
  }

  async fetch(request) {
    return jsonResponse(this.likes)
  }
}
