import k8s from '@kubernetes/client-node';

export async function load() {
	const kc = new k8s.KubeConfig();

	if (process.env.NODE_ENV === 'development') {
		// TODO: find way to get user directory
		const files = import.meta.glob('../../*', { as: 'raw' });
		const kubeconfigFileContent = await files['../../kubeconfig']();
		kc.loadFromString(kubeconfigFileContent);
	} else {
		kc.loadFromCluster();
	}

	const api = kc.makeApiClient(k8s.CoreV1Api);

	const {
		body: { items }
	} = await api.listServiceForAllNamespaces();

	console.log(items[0].spec);

	const services = items
		.filter(({ spec }) => spec?.type === 'NodePort')
		.map(({ spec, metadata }) => {
			return {
				metadata: {
					name: metadata?.name,
					namespace: metadata?.namespace
				},
				spec: {
					ports: JSON.parse(JSON.stringify(spec?.ports))
				}
			};
		});

	return { services };
}
