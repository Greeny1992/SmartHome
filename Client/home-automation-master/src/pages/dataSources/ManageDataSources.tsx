import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonToast,
  IonBackButton,
  IonButton,
  IonLabel,
} from "@ionic/react";
import { add, information, trophy, water } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import "../../services/actions/security";
import { RouteComponentProps } from "react-router";
import { ThunkDispatch } from "redux-thunk";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../services/reducers";
import {
  DataSource,
  ModbusDataPoint,
  ModbusDataSource,
  MQTTDataPoint,
  MQTTDataSource,
} from "../../types/types";
import {
  DataSourceResult,
  fetchDataSourceAction,
  fetchDataSourceActions,
} from "../../services/actions/dataSource";
import {
  BuildForm,
  FieldDescriptionType,
  FormDescription,
} from "../../util/form-builder";
import dataSources from "./DataSources";
import * as Validator from "../../util/validators";
import {
    addModbusDataSource,
  addMQTTDataSource,
  updateModbusDataSource,
  updateMQTTDataSource,
} from "../../services/rest/dataSources";
import { request } from "http";
import { fetchDataSourcesAction } from "../../services/actions/dataSources";
import { executeDelayed } from "../../util/async-helpers";

let basefields: Array<FieldDescriptionType<DataSource>> = [
  {
    name: "name",
    label: "Data Source Name",
    type: "text",
    position: "floating",
    color: "primary",
    validators: [Validator.required, Validator.minLength(4)],
  },
];

let mqttfields: Array<FieldDescriptionType<MQTTDataSource>> = [
  {
    name: "host",
    label: "Host Name",
    type: "text",
    position: "floating",
    color: "primary",
    validators: [Validator.required, Validator.minLength(4)],
  },
  {
    name: "port",
    label: "Port",
    type: "number",
    position: "floating",
    color: "primary",
    validators: [Validator.required, Validator.minValue(1)],
  },
];

let modbusfields: Array<FieldDescriptionType<ModbusDataSource>> = [
  {
    name: "host",
    label: "Host Name",
    type: "text",
    position: "floating",
    color: "primary",
    validators: [Validator.required, Validator.minLength(4)],
  },
  {
    name: "port",
    label: "Port",
    type: "number",
    position: "floating",
    color: "primary",
    validators: [Validator.required, Validator.minValue(1)],
  },
  {
    name: "slaveID",
    label: "Slave ID",
    type: "number",
    position: "floating",
    color: "primary",
    validators: [Validator.required, Validator.minValue(1)],
  },
];

export default (
    mode: "add" | "edit"
  ): React.FC<RouteComponentProps<{ id: string; source: string }>> =>
  ({ history, match }) => {
    const {
      isLoading,
      dataSource,
      errorMessage,
      dataSourceType,
      dataSourceAsMqtt,
      dataSourceAsModbus,
    } = useSelector((s: RootState) => s.dataSource);
    const {  dataPointList } = useSelector((s:RootState) => s.dataPoints);

    const token = useSelector(
      (s: RootState) => s.user.authentication!.token || ""
    );
    const dispatch = useDispatch();

    const thunkDispatch: ThunkDispatch<RootState, null, DataSourceResult> =
      useDispatch();

    let allMQTTfield: Array<FieldDescriptionType<MQTTDataSource>> =
      mqttfields.concat(basefields);
    let allmodbusfield: Array<FieldDescriptionType<ModbusDataSource>> =
      modbusfields.concat(basefields);

    let MQTTform = (mode: string): FormDescription<MQTTDataSource> => ({
      name: `mqttform_${mode}`,
      fields: allMQTTfield,
      submitLabel: mode === "add" ? "Save" : "Update",
      debug: false,
    });

    let Modbusform = (mode: string): FormDescription<MQTTDataSource> => ({
      name: `mqttform_${mode}`,
      fields: allMQTTfield,
      submitLabel: mode === "add" ? "Save" : "Update",
      debug: false,
    });

    let { Form, loading, error } = BuildForm(
      dataSourceType === "MQTTDataSource" ? MQTTform(mode) : Modbusform(mode)
    );

    useEffect(() => {
      if (!dataSource || dataSource.name !== match.params.source) {
        dispatch(fetchDataSourceAction(match.params.source));
      }
    }, []);

    const MQTTFormInfo = () => {
      let { Form, loading, error } = BuildForm<MQTTDataSource>(MQTTform(mode));
      if (!isLoading) {
        if (mode === "edit" && dataSource) {
          return (
            <Form handleSubmit={submitMqtt} initialState={dataSourceAsMqtt!} />
          );
        } else {
          return <Form handleSubmit={submitMqtt} />;
        }
      } else {
        console.log("Empty");
        return <></>;
      }
    };

    const ModbusFormInfo = () => {
      let { Form, loading, error } = BuildForm<ModbusDataSource>(
        Modbusform(mode)
      );
      if (!isLoading) {
        if (mode === "edit" && dataSource) {
          return (
            <Form
              handleSubmit={submitMqtt}
              initialState={dataSourceAsModbus!}
            />
          );
        } else {
          return <Form handleSubmit={submitMqtt} />;
        }
      } else {
        console.log("Empty");
        return <></>;
      }
    };

    const submitMqtt = (mqtt: MQTTDataSource) => {
      dispatch(loading(true));
      (mode === "add"
        ? addMQTTDataSource(token, mqtt)
        : updateMQTTDataSource(token, mqtt)
      )
        .then((source) => dispatch(fetchDataSourceActions.success(source)))
        .then((request) => thunkDispatch(fetchDataSourcesAction()))
        .then((request) => executeDelayed(100, () => history.goBack()))
        .catch((err) => dispatch(error(err)))
        .finally(() => dispatch(loading(false)));
    };

    const submitModbus = (modbus: ModbusDataSource) => {
        console.log("Handle Submit: " + JSON.stringify(modbus))
        dispatch(loading(true));
        (mode === 'add' ? addModbusDataSource(token, modbus) : updateModbusDataSource(token, modbus))
            .then( source => dispatch(fetchDataSourceActions.success(source)))
            .then(r => thunkDispatch(fetchDataSourcesAction()))
            .then(r => executeDelayed(100, ()=>history.goBack()))
            .catch(err => dispatch(error(err)))
            .finally(() => dispatch(loading(false)))
    }

    const NoValuesInfo = () => !isLoading && dataPointList!.length == 0 ?
        (<IonCard>
            <img src='assets/images/img.png'></img>
            <IonCardHeader>
                <IonCardTitle>No DataPoints found...</IonCardTitle>
            </IonCardHeader>


        </IonCard>) : (<></>)

    const ListDataPointsForDriver = () => {

        const items = dataPointList!.map(value => {


            //console.log(value);
            let myinfo;
            if(dataSource!.type == "MQTTDataSource")
            {
                const mqttpoint = value as MQTTDataPoint;

                myinfo = (<IonLabel>Topic: {mqttpoint.topicName}</IonLabel>);
            }
            else
            {
                const modbuspoint = value as ModbusDataPoint;
                myinfo = (
                    <IonLabel>Register Number: {modbuspoint.register} Register Count: {modbuspoint.registerCount}  Register Type: {modbuspoint.registerType} Reading Type: {modbuspoint.readingType}</IonLabel>

                );
            }


            let icon = water;

            return (
                <IonItemSliding key={value.databaseName}>
                    <IonItemOptions side="end">
                        <IonItemOption onClick={() => history.push('/datapoint/'+dataSource!.name+'/' +value.id)}><IonIcon icon={information} /> Details</IonItemOption>
                    </IonItemOptions>
                    <IonItem key={value.databaseName} onClick={() => history.push('/datapoint/'+dataSource!.name+'/' +value.id)}>
                        <IonIcon icon={icon} />
                        {value.name}
                        <div className="item-note" slot="end">
                            {myinfo}
                        </div>
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
              <IonBackButton defaultHref="/datapoints" />
            </IonButtons>
            <IonButtons slot="primary">
              <IonButton
                onClick={() =>
                  history.push("/datapoint/" + dataSource!.name + "/add")
                }
              >
                <IonIcon slot="icon-only" icon={add} />
              </IonButton>
            </IonButtons>
            <IonTitle>
              {mode === "add" ? "New" : "Edit"} Datasource{" "}
              {dataSource ? dataSource.name : ""}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {isLoading ? (
            <IonItem>
              <IonSpinner />
              Loading Data Source...
            </IonItem>
          ) : dataSourceType === "MQTTDataSource" ? (
            <MQTTFormInfo />
          ) : (
            <ModbusFormInfo />
          )}
          <IonCardHeader>
            <IonLabel>
              <h2>
                <b>Data Points</b>
              </h2>
            </IonLabel>
          </IonCardHeader>
          {isLoading ? (
            <IonItem>
              <IonSpinner />
              Loading Datapoints...
            </IonItem>
          ) : (
            <ListDataPointsForDriver />
          )}
          <IonToast
            isOpen={errorMessage ? errorMessage.length > 0 : false}
            onDidDismiss={() => false}
            message={errorMessage}
            duration={5000}
            color="danger"
          />
        </IonContent>
      </IonPage>
    );
  };
