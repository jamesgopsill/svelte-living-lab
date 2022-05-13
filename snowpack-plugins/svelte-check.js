const { spawn } = require('child_process')

module.exports = function (snowpackConfig, pluginOptions) {
	return {
		name: "svelte-check",
		async run({isDev, log}) {

			const check = async () => {
				try {
					let args = ["./node_modules/svelte-check", "--workspace", "./src"]
					if (isDev) args.push("--watch")
					const ls = spawn("node", args)

					ls.stdout.on("data", (data) => {
						log("WORKER_MSG", {
							msg: data.toString()
						})
						if (!isDev) return
					})
				} catch (err) {
					if (/ENOENT/.test(err.message)) {
						log("WORKER_MSG", {
						msg: 'WARN: "svelte-check" run failed. Is svelte-check installed in your project?',
						});
					}
					throw err;
				}
			}

			return check()
			
		}
	}
}