import React from 'react';
import * as Validator from '../../util/validators';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    IonPage
} from '@ionic/react';
import {RouteComponentProps} from 'react-router';
import {LoginData} from '../../types/types';
import { loggedIn } from '../../services/actions/security';
import { useDispatch } from 'react-redux';
import store, {AppDispatch} from "../../services/store";
import { BuildForm, FormDescription } from '../../util/form-builder';
import { login } from '../../services/security';
import { executeDelayed } from '../../util/async-helpers';

type formData = Readonly<LoginData>;

const formDescription: FormDescription<formData> = {
    name: 'login',
    fields: [
        {name: 'username', label: 'Email', type: 'email',
            position: 'floating', color: 'primary', validators: [Validator.required, Validator.email]},
        {name: 'password', label: 'Password', type: 'password',
            position: 'floating', color: 'primary',validators: [Validator.required]}
    ],
    submitLabel: 'Login'
}

const {Form ,loading, error} = BuildForm(formDescription);

export const Login: React.FunctionComponent<RouteComponentProps<any>> = (props) => {

    const dispatch = useDispatch();


    const submit = (loginData: LoginData) => {
        dispatch(loading(true));
        login(loginData)
            .then((loginInfo) => {
                const authresponse = loggedIn(loginInfo);
                dispatch(authresponse);
                executeDelayed(200,() => props.history.replace('/values'))
            })
            .catch((err: Error) => {
                dispatch(error('Error while logging in: ' + err.message));
            })
            .finally(() => dispatch(loading(false)))
    };
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <Form handleSubmit={submit}/>
            </IonContent>
        </IonPage>
    );
}

export default Login