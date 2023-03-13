<script lang="ts">
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import TopAppBar, { Row as TopAppBarRow, Section, Title, AutoAdjust } from '@smui/top-app-bar';

	let topAppBar: TopAppBar;

	export let data: { services: Services[] };

	interface Port {
		nodePort: number;
	}

	interface Services {
		metadata: {
			name: string;
			namespace: string;
		};
		spec: {
			ports: Port[];
		};
	}

	let search: '';

	$: filteredServices = search
		? data.services.filter(
				(service) =>
					service.spec.ports.some(({ nodePort }) => String(nodePort).includes(String(search))) ||
					service.metadata.name.toLocaleLowerCase().includes(String(search))
		  )
		: data.services;

	$: sortedServices = filteredServices
		.slice()
		.sort((a, b) => a.spec.ports[0].nodePort - b.spec.ports[0].nodePort);
</script>

<TopAppBar bind:this={topAppBar} variant="fixed" color="secondary" class="mdc-elevation--z1">
	<TopAppBarRow>
		<Section>
			<img src="/svc.png" class="logo" alt="svc_icon" />
			<Title>NodePort availability checker</Title>
		</Section>
		<Section align="end">
			<Textfield variant="outlined" bind:value={search} input$emptyValueUndefined>
				<Icon class="material-icons" slot="trailingIcon">search</Icon>
			</Textfield>
		</Section>
	</TopAppBarRow>
</TopAppBar>
<AutoAdjust {topAppBar}>
	<DataTable table$aria-label="NodePort list" style="width: 100%; margin-top: 1em">
		<Head>
			<Row>
				<Cell>Namespace</Cell>
				<Cell style="width: 100%;">Name</Cell>
				<Cell>NodePort</Cell>
			</Row>
		</Head>
		<Body>
			{#each sortedServices as service}
				<Row>
					<Cell>{service.metadata.namespace}</Cell>
					<Cell>{service.metadata.name}</Cell>
					<Cell>{service.spec.ports.map((p) => p.nodePort).join(', ')}</Cell>
				</Row>
			{/each}
		</Body>
	</DataTable>
</AutoAdjust>
<footer>NodePort availability checker - Maxime Moreillon - JTEKT Corporation</footer>

<style>
	:global(main) {
		max-width: 80rem;
		margin-inline: auto;
	}

	.logo {
		width: 2.5em;
		height: 2.5em;
	}
	footer {
		margin: 0;
		padding: 0;
		/* background-color: #cccccc; */
		text-align: center;
		padding: 0.75em;
		font-size: 80%;
	}
</style>
