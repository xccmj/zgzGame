function Actor (params) {
    //this.m_gameStatus = params.gameStatus;
    this.m_properties = params.properties;
    this.m_isReady = params.isReady;
    this.m_actorNr = params.actorNr;
    this.m_uid = params.uid;
    this.m_sid = params.sid;
    this.m_identity = false;
    this.m_gender = 0;
    if(params.properties.gender == "FEMALE")
        this.m_gender = 1;//1女人，0 男人
}
