(function () {
    'use strict';
    var randomizer = require('../randomizer/randomizer.js'),
        voteProcessor = require('../vote/vote-processor.js'),
        openProcessor = require('../open/open-processor.js'),
        expressions = {
            roll: /^\/roll/,
            vote: /^yay|nay$/i,
            open: /^\/open/
        };


    function CommentProcessor(apiServer) {
        if (!apiServer) {
            throw new Error('Unable to initialize comment processor: missing api server');
        }

        apiServer.post('/comment', this.processComment);
    }

    CommentProcessor.prototype = {
        processComment: function (request, responder) {
            if (request.body.action === 'created') {
                var commentsUrl = request.body.issue.comments_url,
                    userLogin = request.body.comment.user.login,
                    commentBody = request.body.comment.body;

                if (expressions.roll.test(commentBody)) {
                    console.log(userLogin + ' - ' + commentBody);
                    return responder.status(200).json(randomizer.processRollComment(commentsUrl, userLogin, commentBody));
                }

                if (expressions.vote.test(commentBody)) {
                    console.log(userLogin + ' - ' + commentBody);
                    return responder.status(200).json(voteProcessor.processVote(commentsUrl, userLogin, request.body));
                }

                if (expressions.open.test(commentBody)) {
                    console.log(userLogin + ' - ' + commentBody);
                    return responder.status(200).json(openProcessor.processOpen(commentsUrl, userLogin, request.body));
                }

            }
            return responder.status(200).json();
        }
    };

    module.exports = CommentProcessor;

}());