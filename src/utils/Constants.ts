export class Constants {
    public static readonly Default = "default";
    public static readonly success = "success";
    public static readonly enableZFormsDate = "enableZFormsDate";
    public static readonly error = "error";
    public static readonly status = "active";
    public static readonly pending = "pending";
    public static readonly source = "ZingitCRM";
    public static readonly true = "True";
    public static readonly ascending = "asc";
    public static readonly notinservice = "notinservice";
    public static readonly invalidtoken = "Invalid Token";
    public static readonly invalidapp = "Invalid Application";

    //move to DB
    public static readonly smsShortCode = 91998;
    public static readonly defaultSendCode = 4;
    public static readonly defaultTimeZone = 2;
    public static readonly defaultCredits = 8000;
    public static readonly defaultKeyExpiryDays = -1;
    public static readonly masterUserName = "zingit";
    public static readonly masterPassword = "ZingintothefuturePTek544";
    public static readonly cipherText = "ZINGITCIPHERKEY";
    public static readonly DEFAULTPROVIDER = "iVision";
    public static readonly defaultToDuplicateGUID = "1D8F07E3-855A-445C-AAC8-DC6F1633DBD1";
    //end

    //iVision Routes
    public static readonly duplicateAccount = "account_duplicate.asp";
    public static readonly sendMMS = "contentuploadfilename_send.asp";
    public static readonly accountSettingUpdate = "account_settings_update.asp";
    public static readonly createCompaign = "campaign_create.asp";
    public static readonly sendMessage = "sendmt.asp";
    public static readonly addCredits = "credit_roll.asp";
    public static readonly sendEmail = "sendEmail?accessToken=";
    public static readonly sendHTMLEmail = "sendEmail/html?accessToken=";
    public static readonly getKeywordList = "xml_keyword_list.asp?guid={";
    public static readonly getPhoneNumberList = "tn_list.asp?user_guid={";
    public static readonly addPhoneRequest = "tn_request.asp?user_guid={";
    public static readonly setDefaultPhone = "tn_setdefault.asp?user_guid={";
    public static readonly checkAddPhoneStatus = "tn_request_check.asp?guid={";
    public static readonly setDefaultPhoneOnKeyword = "campaign_update.asp?user_guid={";
    public static readonly getAccountsList = "invites/clients?sort=company_name&sortDirection=ASC&accessToken=bb64b51473b0c798f363eaebca7f822c&";
    public static readonly setCatchAllKeyword = "tn_catchall.asp";
    public static readonly checkAccountCreationStatus = "account_duplicate_check.asp?guid={";
    public static readonly ImportNumber = "importTnOrders";
    public static readonly zingitMainAccountGUID = "176B1256-3437-4EEE-9211-F2D91F9964EC";
    public static readonly getAccountInf0 = "xml_account_settings.asp&master_username=zingit&master_password=ZingintothefuturePTek544";
    public static readonly loginToken = "login_token.asp?ip_address=";

    //Bandwidth Route
    public static readonly SubAccounts = "xml_subaccount_guid.asp";

    //messages
    public static readonly EmailSubject = "[Zingit SMS Provider] Please verify and do not share key.";
    public static readonly EmailBody = "Hi, To complete your account enabling process, we just need to verify your API. Paste the following access key to your (ZingitAuth) sheader: ";

    //ERROR messages
    public static readonly INVALIDSTATE = 'State invalid.';
    public static readonly UNAUTHORIZED = 'Email invalid.';
    public static readonly CHECKEMAILFORKEY = 'Please check your email for the generated key i.e. ';
    public static readonly NOSECRETKEYFOUND = 'Authentication failed. Please pass secret key.';
    public static readonly KEYEXPIRED = 'Authentication key has expired. Please generate key again.';
    public static readonly INCORRECTKEYFOUND = 'Authentication failed. Please pass correct key.';
    public static readonly INCORRECTTOKENFOUND = 'Authentication failed. Please pass correct token.';
    public static readonly USERNAMETAKEN = 'Username already taken.';
    public static readonly USERNAMEEXISTS = 'Username does not exists.';
    public static readonly USERNAMECANTUPDATE = 'Username can not be updated.';
    public static readonly NOAUTHEMAILFOUND = 'Authentication failed. Please pass registered email id where auth key is sent.';

    public static readonly EMAILNOTFOUND = 'Email not found.';
    public static readonly INCORRECTPWD = 'Password is incorrect.';
    public static readonly NOACCOUNT = 'Sorry! No account found.';
    public static readonly SECRETKEY = 'P7LlGDJwOn2u3r-HM22XLPBc9WDkovrqlQP2hf39eHoDErhz2y8p63TqQgJ9egFyEBhnbnmE9LDyL6NChNlmMW6D7Gb3taCox1Q7HXbn-eoMbL3aAddEcGBxZl1FLmAqAwlDc8ioDC0tclOtYOD3tYSZuUSHQzRMydf5D_KOlclOCgflWgcLN8zhl_63ETHIHQ3_yz-RB5SgdH3R6TDJXHFZmsVvVA_9Zg8bcySOw9qQdeMMIfaHobclEEi6yPYcA5ncdPvlqJcXvdYFKn1j_vOFlKGvkGAlxONoY5FKgT5vFiMz0s7JtAeC8RkYsnVVI1fp7OY1JheSXxo_o6w9ZQ';

    // Timezone
    public static readonly hawaiiTZ = "Hawaii-Aleutian";
    public static readonly alaskaTZ = "Alaska";
    public static readonly pacificTZ = "Pacific Time";
    public static readonly mountainTZ = "Mountain Time";
    public static readonly easternTZ = "Eastern Time";
    public static readonly atlanticTZ = "Atlantic Time";
    public static readonly CTZ = "Central Time";

    //IntakeQ 
    public static readonly INTAKEQSSOTOKEN = "/ephemeral";

    //WST
    public static readonly generatePosters = "/generate_posters";

    // rep pro token generate
    public static readonly REPUTATIONPROTOKEN = "/authentication/getAuthLink";

    public static readonly PAYMENT_METHODS = {
        ONLINE: 'online',
        OFFLINE: 'offline'
    }


    public static readonly DOWNLOAD_TICKET_HTML_CONTENT = `<!doctypehtml>
    <html xmlns=http://www.w3.org/1999/xhtml>
    <meta content="text/html; charset=utf-8" http-equiv=Content-Type>
    <title>Mobile Invoice</title>
    <style>
        * {
            margin: 0 auto
        }
    </style>

    <body style=background:#f8f8f8>
        <table cellpadding=0 cellspacing=0
            style="text-align:center;border-spacing:none;font-family:Arial,Helvetica,sans-serif;border:2px solid #E6FB04 ; background-color:#ffffff; width:600px"
            align=center bgcolor=#FFFFFF width=600>
            <tr>
                <td height=20>
            <tr>
                <td>
                    <table cellpadding=0 cellspacing=0 style=text-align:center;border-spacing:none>
                        <td width=35>
                        <td width=570 align=center style=font-size:36px;font-weight:400;color:#cecdcd><img
                                src=width=150px>
                        <td width=35>
                    </table>
            <tr>
                <td width=570 height=20>
            <tr>
                <td width=570 height=1 bgcolor=#E6FB04>
            <tr>
                <td height=35>
            <tr valign=top>
                <td>
                    <table cellpadding=0 cellspacing=0 style=text-align:center;border-spacing:none>
                        <tr valign=top>
                            <td width=35>
                            <td width=570 align=left>
                                <table cellpadding=0 cellspacing=0 style=text-align:center;border-spacing:none>
                                    <tr>
                                        <td height=15 colspan=3>
                                    <tr>
                                        <td style=font-size:24px;font-weight:400;color:#0079c3;text-align:center
                                            colspan=3>Ticket Info
                                </table>
                            <td width=15>
                    </table>
            <tr>
                <td height=30>
            <tr valign=top>
                <td>
                    <table cellpadding=0 cellspacing=0 style=text-align:center;border-spacing:none>
                        <tr valign=top>
                            <td width=35>
                            <td width=570 align=left>
                                <table cellpadding=0 cellspacing=0 style=text-align:left;border-spacing:none align=left>
                                    <tr>
                                        <td width=130 style=font-size:13px;font-weight:400;color:#333;font-weight:700>
                                            Order No :
                                        <td width=5>
                                        <td height=5 style=font-size:14px;font-weight:400;color:#000;text-align:left>
                                            {orderNumber}
                                </table>
                            <td width=15>
                    </table>
            <tr>
                <td height=20>
            <tr valign=top>
                <td>
                    <table cellpadding=0 cellspacing=0 style=text-align:center;border-spacing:none>
                        <tr valign=top>
                            <td width=35>
                            <td width=570 align=left>
                                <table cellpadding=0 cellspacing=0 style=text-align:left;border-spacing:none align=left>
                                    <tr>
                                        <td width=130 style=font-size:13px;font-weight:400;color:#333;font-weight:700>
                                            Event Name:
                                        <td width=5>
                                        <td height=5 style=font-size:14px;font-weight:400;color:#000;text-align:left>
                                            {eventName}
                                </table>
                            <td width=15>
                    </table>
            <tr>
                <td height=20>
            <tr valign=top>
                <td>
                    <table cellpadding=0 cellspacing=0 style=text-align:center;border-spacing:none>
                        <tr valign=top>
                            <td width=35>
                            <td width=570 align=left>
                                <table cellpadding=0 cellspacing=0 style=text-align:left;border-spacing:none align=left>
                                    <tr>
                                        <td width=130 style=font-size:13px;font-weight:400;color:#333;font-weight:700>
                                            Address:
                                        <td width=5>
                                        <td height=5 style=font-size:14px;font-weight:400;color:#000;text-align:left>
                                            {address}
                                </table>
                            <td width=15>
                    </table>
            <tr>
                <td height=20>
            <tr valign=top>
                <td>
                    <table cellpadding=0 cellspacing=0 style=text-align:center;border-spacing:none>
                        <tr valign=top>
                            <td width=35>
                            <td width=570 align=left>
                                <table cellpadding=0 cellspacing=0 style=text-align:left;border-spacing:none align=left>
                                    <tr>
                                        <td width=130 style=font-size:13px;font-weight:400;color:#333;font-weight:700>
                                            Date:
                                        <td width=5>
                                        <td height=5 style=font-size:14px;font-weight:400;color:#000;text-align:left>
                                            {date}
                                </table>
                            <td width=15>
                    </table>
            <tr>
                <td height=20>
                <td height=20>
            <tr valign=top>
                <td>
                    <table cellpadding=0 cellspacing=0 style=text-align:center;border-spacing:none>
                        <tr valign=top>
                            <td width=35>
                            <td width=570 align=left>
                                <table cellpadding=0 cellspacing=0 style=text-align:left;border-spacing:none align=left>
                                    <tr>
                                        <td width=130
                                            style=font-size:13px;font-weight:400;color:#333;font-weight:700;vertical-align:top;>
                                            Price:
                                        <td width=5>
                                        <td height=5 style=font-size:14px;font-weight:400;color:#000;text-align:left>
                                            {Price} INR
                                </table>
                            <td width=15>
                    </table>
            <tr>
                <td height=30>
            <tr>
                <td>
                    <table cellpadding=0 cellspacing=0 style=text-align:center;border-spacing:none>
                        <tr>
                            <td width=35>
                            <td width=570 height=1 bgcolor=#CCCCCC>
                            <td width=15>
                    </table>
            <tr>
                <td height=20>
        </table>`

}
