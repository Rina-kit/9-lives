import {HashRouter} from 'react-router-dom';

import {AppLayout} from './components/AppLayout';

const App = () => {
    return (
        <HashRouter>
            <AppLayout/>
        </HashRouter>
    );
};

export default App;
