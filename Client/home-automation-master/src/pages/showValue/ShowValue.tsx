import { IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonPage, IonRefresher, IonRefresherContent, IonSpinner, IonTitle, IonToolbar, RefresherEventDetail } from "@ionic/react";
import React, { FunctionComponent, useEffect, useState } from "react"
import GaugeChart from "react-gauge-chart";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router"
import { ThunkDispatch } from "redux-thunk";
import { fetchValueAction, fetchValueActions, ValueResult } from "../../services/actions/value";
import { RootState } from "../../services/reducers";
import { fetchValue } from "../../services/rest/values";
import { Value } from "../../types/types";


export const ShowValue: FunctionComponent<RouteComponentProps<{ id: string }>> = ({ match, history }) => {
    
    const { value, isLoading, errorMessage, datatype } = useSelector((s:RootState) => s.value);
    const token = useSelector((s:RootState) => s.user.authentication!.token || '');
    const dispatch = useDispatch();
    const thunkDispatch = dispatch as ThunkDispatch<RootState, null, ValueResult>;
    const RefreshTime = 1;

    const [gauge, setGauge] = useState(0);
    const [gaugeArcs, setGaugeArcs] = useState<number[]>( []);
    const [gaugeArcsColors, setGaugeArcsColors] = useState<string[]>( []);
    const [gaugeText, setGaugeText] = useState("0");
    const [labelText, setLabelText] = useState("");
    const [gaugeVis, setGaugeVis] = useState<React.ReactElement>();
    const [time, setTime] = useState(false);

    const chartStyle = {
        width: 250
    };

    let mgauge  = (<></>);



    let gaugeArc = [];
    useEffect(() => {
            thunkDispatch(fetchValueAction(match.params.id)).finally(() => updateVisuals(value));
    }, [match.params.id]);

    const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
        console.log('Begin async operation on Value');
        fetchValue(token, match.params.id)
            .then(values => dispatch(fetchValueActions.success(values)))
            .then(() => updateVisuals(value))
            .then(() => event.detail.complete())
            .catch(err => dispatch(fetchValueActions.failure(err)))
    }



    const updateVisuals = (gaugeval : Value | null) => {
        console.log("gauge " , gaugeval)
        if(gaugeval && gaugeval.visuals) {
            if(gaugeval.dataPoint.dataType == "Float") {
                const minval = gaugeval.visuals!.minValue;
                const maxval = gaugeval.visuals!.maxValue;
                const va = parseFloat(gaugeval.sample.value);

                const valutext = va + " " + gaugeval.visuals!.unit;

                const perc = (100 / (Math.abs(minval!) + maxval!) * va) / 100;
                setGauge((gauge) => (gauge = perc));
                setGaugeText((gaugeText) => (gaugeText = valutext))
            }
            else
            {
                if(gaugeval.visuals != null)
                {
                    setLabelText(gaugeval!.visuals!.finalText!);
                }
            }
        }
    }


    const AlarmLabel = (available: boolean, text: string = '') => available ?
        (<IonItem>
            <IonLabel > {text} </IonLabel>
        </IonItem>) : (<></>);


    const DataVisualization = () => {
        if(!isLoading) {
            let arr  : number[] = [];
            let colors : string[] = [];
            if(value.visuals != null) {

                let hasAlarm = false;
                let hasWarning = false;
                let hasTrip = false;
                let warningval = 0;
                let alarmval = 0;
                let tripval = 0;
                const unit = " " +value.visuals.unit;

                if (datatype === "Float" || datatype == "1") {
                    const minval = value.visuals!.minValue;
                    const maxval = value.visuals!.maxValue;

                    let warningperc = -1;
                    let alarmperc = -1;
                    let tripperc = -1;



                    if (value.visuals.thresholds != null) {
                        if (value.visuals.thresholds!.Warning != null) {
                            warningval = value.visuals.thresholds.Warning.value;
                            warningperc = (100 / (Math.abs(minval!) + maxval!) * warningval) / 100;
                            hasWarning = true;
                        }

                        if (value.visuals.thresholds!.Alarm != null) {
                            alarmval = value.visuals.thresholds!.Alarm.value;
                            alarmperc = (100 / (Math.abs(minval!) + maxval!) * alarmval) / 100;
                            hasAlarm = true;
                        }

                        if (value.visuals.thresholds!.Trip != null) {
                            tripval = value.visuals.thresholds!.Trip.value;
                            tripperc = (100 / (Math.abs(minval!) + maxval!) * tripval) / 100;
                            hasTrip = true;
                        }
                    }

                    if (warningperc > -1 && alarmperc > -1 && tripperc > -1) {
                        var sum = 1 - ((1-warningperc) + (1-alarmperc) + (1-tripperc));
                        arr.push(tripperc);
                        arr.push(alarmperc);
                        arr.push(warningperc);
                        arr.push(sum);
                        colors.push("#5BE12C")
                        colors.push("#F5CD19")
                        colors.push("#EA4228")
                        colors.push("#8d32a8")

                    } else if (warningperc > -1 && alarmperc > -1) {
                        var sum = 1 - ((1-warningperc) + (1-alarmperc));

                        arr.push(alarmperc);
                        arr.push(warningperc);
                        arr.push(sum);
                        colors.push("#5BE12C")
                        colors.push("#F5CD19")
                        colors.push("#EA4228")

                    } else if (warningperc > -1) {
                        var sum = 1 - (warningperc);
                        arr.push(warningperc);
                        arr.push(sum);
                        colors.push("#5BE12C")
                        colors.push("#F5CD19")
                    } else {
                        arr.push(1);
                        colors.push("#5BE12C")
                    }


                }

                if (datatype === "Float" || datatype == "1") {
                    return (
                        <div>
                            <GaugeChart
                                id="gauge-chart"
                                textColor="#333"
                                style={chartStyle}
                                animate={true}
                                animateDuration={500}
                                arcsLength={arr}
                                // arcsLength={[0.8, 0.15, 0.05]}
                                //colors={["#5BE12C", "#F5CD19", "#EA4228"]}
                                colors={colors}
                                formatTextValue={(value) => gaugeText}
                                percent={gauge}
                            />
                            {AlarmLabel(hasWarning, "Warning Value : " + warningval + unit)}
                            {AlarmLabel(hasAlarm, "Alarm Value : " + alarmval + unit)}
                            {AlarmLabel(hasTrip, "Trip Value : " + tripval + unit)}
                        </div>
                    );
                }
                else
                {
                    return   <IonItem> {labelText}</IonItem>      ;
                }


            }
            else {
                return   <IonItem> {labelText}</IonItem>      ;
            }


        }
        else
        {
            console.log("Empty");
            return (<></>)
        }
    };



    const spinner = (isLoading: boolean, text: string = 'Loading Trip...') => isLoading ?
        (<IonItem>
            <IonSpinner /> {text}
        </IonItem>) : (<></>);


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref='/values/' />
                    </IonButtons>
                    <IonTitle>{(value && value.dataPoint) && value.dataPoint.name}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                {isLoading ? <IonItem><IonSpinner />Loading Values...</IonItem> : (<></>)}
                <IonCard class="welcome-card">
                    <IonCardHeader>

                        <IonCardTitle>{value.dataPoint.name}</IonCardTitle>
                        <IonCardSubtitle>{value.dataPoint.description}</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent justify-content-center align-items-center >

                        {isLoading ? <IonItem><IonSpinner />Loading Values...</IonItem> : <DataVisualization/>}
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}