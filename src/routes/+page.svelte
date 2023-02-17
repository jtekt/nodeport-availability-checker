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
		? data.services.filter((service) =>
				service.spec.ports.some(({ nodePort }) => String(nodePort).includes(String(search)))
		  )
		: data.services;

	$: sortedServices = filteredServices
		.slice()
		.sort((a, b) => a.spec.ports[0].nodePort - b.spec.ports[0].nodePort);
</script>

<TopAppBar bind:this={topAppBar} variant="fixed">
	<TopAppBarRow>
		<Section>
			<Title>NodePort availability checker</Title>
		</Section>
		<Section align="end">
			<Textfield
				variant="filled"
				color="green"
				type="number"
				bind:value={search}
				input$emptyValueUndefined
			>
				<Icon class="material-icons" slot="trailingIcon">search</Icon>
			</Textfield>
		</Section>
	</TopAppBarRow>
</TopAppBar>
<AutoAdjust {topAppBar}>
	<main>
		<DataTable table$aria-label="NodePort list" style="width: 100%;">
			<Head>
				<Row>
					<Cell>Namespace</Cell>
					<Cell>Name</Cell>
					<Cell>NodePort</Cell>
				</Row>
			</Head>
			<Body>
				{#each sortedServices as service}
					<Row>
						<Cell>{service.metadata.namespace}</Cell>
						<Cell>{service.metadata.name}</Cell>
						<!-- TODO: multiple -->
						<Cell>{service.spec.ports.map((p) => p.nodePort).join(', ')}</Cell>
					</Row>
				{/each}
			</Body>
		</DataTable>
	</main>
</AutoAdjust>
