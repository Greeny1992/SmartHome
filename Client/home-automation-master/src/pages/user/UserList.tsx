import { IonCard, IonCardHeader, IonCardTitle, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonItem, IonList, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonButton, IonTitle, IonContent, IonSpinner, IonToast } from "@ionic/react";
import { skull, information, add } from "ionicons/icons";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { fetchUsersAction } from "../../services/actions/security";
import { RootState } from "../../services/reducers";

const UserList: React.FC<RouteComponentProps> = ({ history }) => {

    const { userlist, isLoading, errorMessage } = useSelector((s:RootState) => s.admin);
    const token = useSelector((s:RootState) => s.user.authentication!.token || '');
    const dispatch = useDispatch();

    useEffect(() => {
         dispatch(fetchUsersAction()) }, []);

    const NoValuesInfo = () => !isLoading && userlist?.length == 0 ?
        (<IonCard>
            <img src='assets/images/img.png'></img>
            <IonCardHeader>
                <IonCardTitle>No Users found...</IonCardTitle>
            </IonCardHeader>
        </IonCard>) : (<></>)

    const ListUsers = () => {

        const items = userlist!.map(value => {

            let icon = skull;

            let usertext = value.firstname + " " + value.lastname + " (" + value.role+")";
            return (
                <IonItemSliding key={value.id}>
                    <IonItemOptions side="end">
                        <IonItemOption onClick={() => { console.log(value.id) }}><IonIcon icon={information} /> Details</IonItemOption>
                    </IonItemOptions>
                    <IonItem key={value.id} onClick={() => history.push('/users/edit/' +value.id)}>
                        <IonIcon icon={icon} />
                        {usertext}
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
                    <IonButtons slot="primary">
                        <IonButton onClick={() => history.push('/users/add')}>
                            <IonIcon slot="icon-only" icon={add}/>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>User List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                {isLoading ? <IonItem><IonSpinner />Loading Users...</IonItem> : <ListUsers />}
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

export default UserList;