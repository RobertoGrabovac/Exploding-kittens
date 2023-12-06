
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  

function handleErrors(response) {
    if (typeof(response) !== "object") {
        console.log("Server error: ", response);
        return null;
    }
    if (typeof (response.error) === 'undefined') {
        return response;
    }
    console.log("Error: ", response.error);
    return null;
}

function postAndRedirect(url, postData)
{
    var postFormStr = "<form method='POST' action='" + url + "'>\n";

    for (var key in postData)
    {
        if (postData.hasOwnProperty(key))
        {
            postFormStr += "<input type='hidden' name='" + key + "' value='" + postData[key] + "'></input>";
        }
    }

    postFormStr += "</form>";

    var formElement = $(postFormStr);

    $('body').append(formElement);
    $(formElement).submit();
}