import { IonCard, IonCardHeader, IonCardTitle, RefresherEventDetail, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonItem, IonAvatar, IonLabel, IonList, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonRow, IonCol, IonButton, IonSpinner, IonToast } from "@ionic/react";
import { alertCircle, information } from "ionicons/icons";
import { FunctionComponent, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ThunkDispatch } from "redux-thunk";
import { AlarmListResult, fetchAllAlarmListEntriesAction, fetchAlarmListEntriesActions } from "../../services/actions/alarmList";
import { RootState } from "../../services/reducers";
import { fetchAlarmListEntries } from "../../services/rest/alarmList";
import Moment from "moment";

Moment.locale('de');

export const AlarmList: FunctionComponent<RouteComponentProps<{}>> = ({ match, history }) => {


    const { alarmListEntries, isLoadingAlarmList, errorMessage } = useSelector((s:RootState) => s.alarmList);
    const token = useSelector((s:RootState) => s.user.authentication!.token || '');
    const dispatch = useDispatch();
    const thunkDispatch: ThunkDispatch<RootState, null, AlarmListResult> = useDispatch();

    const [filter, setFilter] = useState("all");

    useEffect(() => {

        if (!alarmListEntries || alarmListEntries.length === 0) {
   //dispatch(fetchAllAlarmListEntriesAction)
            thunkDispatch(fetchAllAlarmListEntriesAction(filter));
        }
    }  , []);


    const NoValuesInfo = () => !isLoadingAlarmList && alarmListEntries!.length == 0 ?
        (<IonCard>
            <img src='assets/images/img.png'></img>
            <IonCardHeader>
                <IonCardTitle>No Alarm List Entries found...</IonCardTitle>
            </IonCardHeader>


        </IonCard>) : (<></>)

    const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
        console.log('Begin async operation on Value List');
        fetchAlarmListEntries(token, filter)
            .then(values => dispatch(fetchAlarmListEntriesActions.success(values)))
            .then(() => event.detail.complete())
            .catch(err => dispatch(fetchAlarmListEntriesActions.failure(err)))
    }

    const updateFilter = (event: string) => {

        setFilter(event);
        console.log('Filtering for ' + event);
        thunkDispatch(fetchAllAlarmListEntriesAction(filter));
    }


    const ListAlarmList = () => {

        const items = alarmListEntries.map(value => {

            const icon = alertCircle;
            const text = value.alarmText;
            const type = value.alarmType;
            const status = value.alarmStatus;
            const occdata = Moment(value.activeDate).format('DD.MM.YYYY hh:mm:ss');
            let dectivedate = "Still Active";

            if(status != "Active")
            {
                dectivedate = Moment(value.deactiveDate).format('DD.MM.YYYY hh:mm:ss');
            }


            const id = value.id;

            let alertColor = "#5BE12C"

            if(value.alarmType === "Warning")
            {
                alertColor = "#F5CD19"
            }
            else if(value.alarmType === "Alarm")
            {
                alertColor = "#EA4228"
            }
            else if(value.alarmType === "Trip")
            {
                alertColor = "#8d32a8"
            }
            return (
                <IonItemSliding key={id}>
                    <IonItemOptions side="end">
                        <IonItemOption onClick={() => history.push('/alarmEntry/' +id)}><IonIcon icon={information} /> Details</IonItemOption>
                    </IonItemOptions>
                    <IonItem key={id} onClick={() => history.push('/alarmEntry/' +id)}>
                        <IonAvatar slot="start">
                            <h3 ><IonIcon icon={icon} color="blue" /></h3>
                        </IonAvatar>
                        <IonLabel  class="warning">
                            {type}
                        </IonLabel>
                        <IonLabel  class="warning">
                            {status}
                        </IonLabel>
                        <IonLabel  class="warning">
                            {occdata}
                        </IonLabel>
                       <IonLabel  class="warning">
                           {dectivedate}
                       </IonLabel>

                        <IonLabel >
                            <h2>{text}</h2>
                            <h4>{occdata}</h4>
                        </IonLabel>
                    </IonItem>
                </IonItemSliding>
            );

        });
        return items.length > 0 ? <IonList>{items}</IonList> : <NoValuesInfo />;
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Alarm List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
              <IonRow class="ion-align-items-center">
                  <IonCol size="12">
                      <IonButton color="success" onClick={() => {updateFilter("All")}} >All</IonButton>
                    <IonButton color="success" onClick={() => {updateFilter("Active")}} >Active Only</IonButton>
                    <IonButton color="success" onClick={() => {updateFilter("Deactive")}} >Deactive Only</IonButton>
                    <IonButton color="success" onClick={() => {updateFilter("Unacknowledged")}} >Unacknowledged Only</IonButton>
                </IonCol> </IonRow>
                <IonItem>
                    <IonAvatar slot="start">
                        <h3 ></h3>
                    </IonAvatar>
                    <IonLabel > <b>Alarm Type</b>  </IonLabel>
                    <IonLabel >  <b>Status </b></IonLabel>
                    <IonLabel >  <b>Activation </b></IonLabel>
                    <IonLabel >  <b>Deactivation </b></IonLabel>
                    <IonLabel>  <b>Message </b></IonLabel>
                </IonItem>
                {isLoadingAlarmList ? <IonItem><IonSpinner />Loading Alarm List...</IonItem> : <ListAlarmList />}
                <IonToast
                    isOpen={errorMessage ? errorMessage.length > 0 : false}
                    onDidDismiss={() => false}
                    message={errorMessage}
                    duration={5000}
                    color='danger'
                />
                
            </IonContent>
        </IonPage>
    );
};

export default AlarmList;