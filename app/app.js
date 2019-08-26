$(document).ready(function () {
  app.initialized()
    .then(function (_client) {
      window.client = _client;
      client.events.on('app.activated',
        function () {
          clickEventHandler();
        });
    },
      function (error) {
        console.error('Error' + error);
      });


  /**
   * Function that triggered on app load, with all event handlers
   */
  function clickEventHandler() {
    $('#createIssue').click(function () {
      createIssue();
    });
  }


  /**
   *  Function to crate a Github Issue
   */
  function createIssue() {
    getTicketDetails()
      .then(function (data) {
        let ticket = data.ticket;
        CreateIssueHelper(ticket);
      })
      .catch(function (error) {
        console.error(error);
      });
  }


  /**
   * Helper Function to create issue in Github
   * @param {*} ticket // Ticket Object 
   */
  function CreateIssueHelper(ticket) {

    let headers = {
      Authorization: 'token <%= access_token %>',
      'User-Agent': 'Sample'
    };
    let body = JSON.stringify({
      "title": `${ticket.subject}`,
      "body": `${ticket.description_text}`
    });
    let options = { headers: headers, isOAuth: true, body: body };
    client.request.post(`https://api.github.com/repos/velmurugan-balasubramanian/Weather-Buddy/issues`, options).then(function () {
      showNotification('success', 'success', 'issue has  en successfully created in Github')
    }).catch(function (error) {
      console.error("error", error);
    })
  }


  /**
   *  Helper Function to Fetch the current ticket details 
   */
  function getTicketDetails() {

    let ticket = client.data.get('ticket').then(
      function (data) {
        return data;
      })
      .catch(function (error) {
        return error;
      })
    return ticket;
  }


  /**
   * Function to show notification to the user in the front end
   * @param {string} type     Type of error message 
   * @param {string} title    Title of the message
   * @param {string} message  Notification message
   */

  function showNotification(type, title, message) {
    client.interface.trigger("showNotify", {
      type: `${type}`,
      title: `${title}`,
      message: `${message}`
    }).then(function (data) {
      console.info('succes', data);

    }).catch(function (error) {
      console.error('error', error);
    });
  }
});
