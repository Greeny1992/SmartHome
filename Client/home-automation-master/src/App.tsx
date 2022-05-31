import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import ValueList from './pages/list/ValueList';
import { SecureRoute } from './components/SecureRoute';
import { ShowValue } from './pages/showValue/ShowValue';
import DataSourceList from './pages/dataSources/DataSources';
import ManageDataSources from './pages/dataSources/ManageDataSources';
import AlarmList from './pages/alarmList/AlarmList';
import { AlarmEntry } from './pages/alarmEntry/AlarmEntry';
import UserList from './pages/user/UserList';
import User from "./pages/user/User";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/home" component={Home} exact={true} />
            <Route path="/login" component={Login} exact={true} />
            <SecureRoute path="/values"  component={ValueList} exact={true} />
            <SecureRoute path="/values/show/:id"  component={ShowValue} exact={true} />
            <SecureRoute path="/dataSources"  component={DataSourceList} exact={true} />
            <SecureRoute path="/dataSource/:source"  component={ManageDataSources("edit")} exact={true} />
            <SecureRoute path="/alarmList"  component={AlarmList} exact={true} />
            <SecureRoute path="/alarmEntry/:id"  component={AlarmEntry} exact={true} />
            <SecureRoute path="/users/"  component={UserList} exact={true} />
            <SecureRoute path="/users/add"  component={User("add")} exact={true} />
            <SecureRoute path="/users/edit/:id"  component={User("edit")} exact={true} />
            <Route path="/" exact={true}>
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
