<script lang="ts">
	import Job from "./components/Job.svelte"
	import Machine from "./machines/Machine.svelte"
	import About from "./components/About.svelte"
	import NavBar from "./components/NavBar.svelte"
	import Track from "./components/Track.svelte"
	import Settings from "./components/Settings.svelte"
	import url from "./stores/url"
	import Footer from "./components/Footer.svelte"
</script>

<NavBar />
<div class="m-2">
	{#if $url.hash === "" || $url.hash === "#/" || $url.hash === "#"}
		<About />
	{:else if $url.hash === "#/job"}
		<Job />
	{:else if $url.hash === "#/machine"}
		<Machine />
	{:else if $url.hash === "#/track"}
		<Track />
	{:else if $url.hash === "#/settings"}
		<Settings />
	{:else}
		<h1>404</h1>
	{/if}
	<Footer />
</div>
