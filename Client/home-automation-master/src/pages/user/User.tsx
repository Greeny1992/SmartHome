import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonSpinner,
} from "@ionic/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { fetchUserAction } from "../../services/actions/security";
import { RootState } from "../../services/reducers";
import { register } from "../../services/rest/security";
import { User } from "../../types/types";
import { executeDelayed } from "../../util/async-helpers";
import { FormDescription, BuildForm } from "../../util/form-builder";
import * as Validator from "../../util/validators";

const form = (mode: string): FormDescription<User> => ({
  name: "registration",
  fields: [
    {
      name: "userName",
      label: "Username",
      type: "text",
      position: "floating",
      color: "primary",
      validators: [Validator.required, Validator.minLength(4)],
    },
    {
      name: "firstname",
      label: "Firstname",
      type: "text",
      position: "floating",
      color: "primary",
      validators: [Validator.required, Validator.minLength(4)],
    },
    {
      name: "lastname",
      label: "Lastname",
      type: "text",
      position: "floating",
      color: "primary",
      validators: [Validator.required, Validator.minLength(4)],
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      position: "floating",
      color: "primary",
      validators: [Validator.required],
      options: [
        { key: "Admin", value: "Administrator" },
        { key: "User", value: "User" },
      ],
    },
    {
      name: "active",
      label: "Active",
      type: "select",
      position: "floating",
      color: "primary",
      options: [
        { key: true, value: "Active" },
        { key: false, value: "Inactive" },
      ],
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      position: "floating",
      validators: [Validator.required, Validator.minLength(8)],
    },
  ],
  submitLabel: mode === "add" ? "Save" : "Update",
});

export default (
    mode: "add" | "edit"
  ): React.FC<RouteComponentProps<{ id: string }>> =>
  ({ history, match }) => {
    const dispatch = useDispatch();
    const token = useSelector(
      (s: RootState) => s.user.authentication!.token || ""
    );

    const { user, isLoading, errorMessage } = useSelector(
      (s: RootState) => s.admin
    );

    const { Form, loading, error } = BuildForm(form(mode));

    useEffect(() => {
      if (mode == "edit" && (!user || user.id != match.params.id)) {
        dispatch(fetchUserAction(match.params.id));
      }
    });

    const submit = (user: User) => {
      dispatch(loading(true));
      register(user, token)
        .then((result: {}) => {
          executeDelayed(100, () => history.replace("/users"));
        })
        .catch((err: Error) => {
          dispatch(error(err.message));
        })
        .finally(() => dispatch(loading(false)));
    };

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/login" />
            </IonButtons>
            <IonTitle>
              {mode === "add" ? "New" : "Edit"} User {user ? user.fullName : ""}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {isLoading ? (
            <IonItem>
              <IonSpinner />
              Loading User...
            </IonItem>
          ) : mode === "edit" ? (
            <Form handleSubmit={submit} initialState={user!} />
          ) : (
            <Form handleSubmit={submit} />
          )}
        </IonContent>
      </IonPage>
    );
  };
