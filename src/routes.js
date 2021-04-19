import { useEffect } from 'react';
import { Router, Route, Redirect } from "react-router";
import { createBrowserHistory } from "history";
import WelcomePage from './pages/WelcomePage';
import WalletListPage from './pages/WalletList';
import WalletApi from './api/WalletApi';
import Navigation from './api/NavigationApi';
import AddWalletWizard from './pages/AddWalletWizard';
import ImportWalletWizard from './pages/ImportWalletWizard';
import SendTokensWizard from './pages/SendTokensWizard';

const history = createBrowserHistory()

const Routes = () => {
    useEffect(() => {
        async function defaultRedirect() {
            const hasMasterPassword = await WalletApi.hasMasterPassword();

            if (!hasMasterPassword)
                Navigation.goToSetMasterPassword(history);
        }

        defaultRedirect();
    }, [])
    return (
        <Router history={history}>
            <Route exact path='/wallet/list' component={WalletListPage} />
            <Route exact path='/wallet/new' component={AddWalletWizard} />
            <Route exact path='/wallet/import' component={ImportWalletWizard} />
            <Route exact path='/wallet/send-tokens' component={SendTokensWizard} />
            {/*<Route exact path='/wallet/deploy-contract' component={SendTransactionWizard} />*/}
            <Route exact path='/' component={WelcomePage} />
            <Redirect to='/wallet/list' />
        </Router>);

}

export default Routes