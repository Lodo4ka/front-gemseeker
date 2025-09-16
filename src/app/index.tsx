import './styles/index.css';
import '@livekit/components-styles';

import { Routing } from 'pages';

import { withProviders } from './providers';

const App = () => <Routing />;

export default withProviders(App);
