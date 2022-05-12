class ServerConfig {
    private _host = "http://localhost:5010/api";
    private _loginURI = `${this._host}/User/Login`;
    private _valuesControllerURI = `${this._host}/Value/`;
    private _AlarmListControllerURI = `${this._host}/AlarmList/`;
    private _DataSourcesControllerURI = `${this._host}/DataSource/`;
    private _DataPointControllerURI = `${this._host}/DataPoint/`;

    public get host(): string {
        return this._host
    };

    public get loginURI(): string {
        return this._loginURI
    };

    public get getValuesControllerURI(): string {
        return this._valuesControllerURI
    };

    public get getDataSourceControllerURI(): string {
        return this._DataSourcesControllerURI
    };

    public get getAlarmListControllerURI(): string {
        return this._AlarmListControllerURI
    };

    public get getDataPointControllerURI(): string {
        return this._DataPointControllerURI
    };



}

export default new ServerConfig()