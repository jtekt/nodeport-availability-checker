import k8s from '@kubernetes/client-node';

export async function load() {
	const kc = new k8s.KubeConfig();

	// const files = import.meta.glob('/config/*', { as: 'raw' });
	// const kubeconfigFileContent = await files['/config/kubeconfig']();
	// kc.loadFromString(kubeconfigFileContent);

	kc.loadFromCluster();

	const api = kc.makeApiClient(k8s.CoreV1Api);

	const {
		body: { items }
	} = await api.listServiceForAllNamespaces();

	const services = items
		.map(({ metadata }) => {
			const config = metadata?.annotations?.['kubectl.kubernetes.io/last-applied-configuration'];
			if (!config) return null;
			try {
				const parsedConfig = JSON.parse(config);
				return parsedConfig;
			} catch (error) {
				return null;
			}
		})
		.filter((service) => !!service && service.spec.type === 'NodePort');

	return { services };
}
