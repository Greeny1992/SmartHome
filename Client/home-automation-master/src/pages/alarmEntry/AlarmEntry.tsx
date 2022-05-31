import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonItem,
    IonPage,
    IonSpinner,
    IonText,
    IonTitle,
    IonToast,
    IonToolbar,
} from "@ionic/react";
import { alertCircle } from "ionicons/icons";
import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ThunkDispatch } from "redux-thunk";
import {
    AlarmEntryResult,
    fetchAlarmListEntryAction,
    fetchAllAlarmListEntriesAction,
} from "../../services/actions/alarmList";
import { RootState } from "../../services/reducers";
import { AlarmListEntry } from "../../types/types";

import Moment from "moment";
import { AcknowledgeEntry } from "../../services/rest/alarmList";
import { executeDelayed } from "../../util/async-helpers";

Moment.locale('de');

export const AlarmEntry: FunctionComponent<
    RouteComponentProps<{ id: string }>
> = ({ match, history }) => {
    const { alarmListEntry, isLoadingAlarmList, errorMessage } = useSelector(
        (s: RootState) => s.alarmList
    );
    const token = useSelector(
        (s: RootState) => s.user.authentication!.token || ""
    );

    const role = useSelector(
        (s: RootState) => s.user.user!.role
    );
    const dispatch = useDispatch();
    const thunkDispatch = dispatch as ThunkDispatch<
        RootState,
        null,
        AlarmEntryResult
    >;

    useEffect(() => {
        thunkDispatch(fetchAlarmListEntryAction(match.params.id));
    }, [match.params.id]);

    const [error, setError] = useState<string>('');

    const Acknowledge = () => {
        console.log("Handle Acknowledge");
        AcknowledgeEntry(token, match.params.id, "")
        .then( source => dispatch(fetchAlarmListEntryAction(match.params.id)))
        .then(r => thunkDispatch(fetchAllAlarmListEntriesAction("All")))
        .then(r => executeDelayed(100, ()=>history.goBack()))
        .catch((err: Error) => {
            console.log(err.message);
            dispatch(setError(err.message));
        });


    }

    const AlarmListEntry = () => {
        if (alarmListEntry) {
            const value = alarmListEntry;
            const icon = alertCircle;
            const text = value.alarmText;
            const type = value.alarmType;
            const status = value.alarmStatus;
            const ackstat = value.acknowledgeStatus;
            const occdata = Moment(value.activeDate).format('DD.MM.YYYY hh:mm:ss');
            let dectivedate = "Still Active";

            if (status != "Active") {
                dectivedate = Moment(value.deactiveDate).format('DD.MM.YYYY hh:mm:ss');
            }


            const id = value.id;

            let alertColor = "#5BE12C"

            if (value.alarmType === "Warning") {
                alertColor = "#F5CD19"
            } else if (value.alarmType === "Alarm") {
                alertColor = "#EA4228"
            } else if (value.alarmType === "Trip") {
                alertColor = "#8d32a8"
            }
            return (
                <IonCard class="welcome-card">
                    <IonCardHeader>
                        <IonCardTitle>{type}</IonCardTitle>
                        <IonCardSubtitle>
                            {occdata} - {dectivedate}
                        </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent justify-content-center align-items-center>
                        <IonText>{text}</IonText>
                    </IonCardContent>
                    {role === "Admin" ? 
                        <IonButton
                        color="danger"
                        disabled={ackstat === "Acknowledged" ? true : false}
                        onClick={ () => Acknowledge() }
                        >
                        Acknowledge
                        </IonButton> : <></>
                    }
                   
                </IonCard>
            );
        } else {
            console.log("Empty");
            return (<></>);
        }
        };

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/alarmList" />
                        </IonButtons>
                        <IonTitle>Alarm List Entry</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    {isLoadingAlarmList ? (
                        <IonItem>
                            <IonSpinner />
                            Loading Alarm List Entry...
                        </IonItem>
                    ) : (
                        <></>
                    )}
                    {isLoadingAlarmList ? (
                        <IonItem>
                            <IonSpinner />
                            Loading Alarm List Entry...
                        </IonItem>
                    ) : (
                        <AlarmListEntry />
                    )}
                    <IonToast
                        isOpen={error ? error !== "" : false}
                        onDidDismiss={() => false}
                        message={error}
                        duration={5000}
                        color="danger"
                    />
                </IonContent>
            </IonPage>
        );
    
}
