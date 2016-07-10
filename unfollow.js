/**
 * Created by social13 on 7/9/16.
 */

(function(d, $){

	var Popup = {
		message: "Preparing.. Please wait.",
		title: "Twitter Unfollower",
		authorMessage: "<small style='font-size:11px;float:left'>Created by Özgür Senekci</small>",
		created: false,
		element: null,
		create: function(){
			if( this.created === false ){
				var curtain = $(d.createElement("div"));
				curtain.css({
					display: "none",
					position: "fixed",
					width: "100%",
					height: "100%",
					zIndex: "9998",
					background: "rgba(0,0,0,.6)"
				});

				var modalParent = $(d.createElement("div"));
				modalParent.attr({
					 className: "modal fade",
					 id: "social13-twitter-unfollower-modal"
				 });
				modalParent.css({
					display: "none",
					position: "fixed",
					width: "450px",
					top: "30%",
					left: "50%",
					marginLeft: "-225px",
					zIndex: "9999"
				});

				var dialog = $(d.createElement("div"));
				dialog.addClass("modal-dialog");

				var content = $(d.createElement("div"));
				content.addClass("modal-content");

				var header = $(d.createElement("div"));
				header
					.addClass("modal-header")
					.css("cursor", "default");

				var title = $(d.createElement("h4"));
				title
					.addClass("modal-title")
					.html(this.title);

				var closeButton = $(d.createElement("button"));
				closeButton
					.attr("id", "social13-twitter-unfollower-modal-close")
					.html('<span aria-hidden="true">&times;</span>')
					.css({
						fontSize: "13px",
						marginLeft: "5px",
						cursor: "pointer",
						display: "none"
					})
					.click(function(){
						Popup.hide();
					});

				var body = $(d.createElement("div"));
				body
					.addClass("modal-body")
					.css("text-align", "center")
					.html(this.message);

				var footer = $(d.createElement("div"));
				footer
					.addClass("modal-footer")
					.html(this.authorMessage);

				var interrupt = $(d.createElement("a"));
				interrupt
					.html("interrupt")
					.css({
						float: "right",
						fontSize: "10px",
						cursor: "pointer"
					 })
					.hide()
					.click(function(e){
						Unfollower.interrupt();
						e.preventDefault();
					});

				this.element = {
					modal: modalParent,
					title: title,
					body: body,
					curtain: curtain,
					closeButton: closeButton,
					interrupt: interrupt
				};

				modalParent.append(dialog);
				dialog.append(content);
				content.append(header);
				header.append(title);
				title.append(closeButton);
				content.append(body);
				content.append(footer);
				footer.append(interrupt);
				$(d.body).prepend(curtain);
				$(d.body).append(modalParent);

				this.created = true;

			}
		},
		show: function(){
			if( this.created === false )
				this.create();
			this.element.curtain.fadeIn(200);
			this.element.modal.fadeIn(500);
		},
		hide: function(){
			if( this.created === true ){
				this.element.modal.fadeOut(350);
				this.element.curtain.fadeOut(200);
			}
		},
		setMessage: function(message){
			if( this.created === false )
				this.create();
			this.element.body.html(message);
		}
	};


	var Unfollower = {
		scrollCount: 20,
		current: 0,
		offset: 0,
		allUsers: 0,
		unfollowedUsers: 0,
		notFollowing: 0,
		interval: 0,
		process: function(){
			Popup.show();
			Popup.element.interrupt.show();
			var self = this;
			this.interval = setInterval(function(){
				if( self.current < self.scrollCount ){
					self.offset = (self.current + 10) * window.innerHeight;
					window.scrollTo(0, self.offset);
					self.current++;
					Popup.setMessage("<p>" + Popup.message + "</p><p>Target scroll count: " + self.scrollCount + "</p><p>Current scroll count: " + self.current + "</p>");
				}
				else{
					clearInterval(self.interval);
					Popup.element.interrupt.hide();
					self.removeThemAll();
				}
			}, 1300);
		},
		removeThemAll: function(){
			scrollTo(0, 0);
			this.allUsers = $(".Grid-cell.u-size1of2.u-lg-size1of3.u-mb10").length;
			$(".FollowStatus").each(function(i, ele){
				$(ele)
					.parents(".Grid-cell.u-size1of2.u-lg-size1of3.u-mb10")
					.remove();
			});
			this.unfollowUsers();
		},
		unfollowUsers: function(){
			var
				notFollowing = $("div:not(.not-following) > .user-actions-follow-button"),
				length = notFollowing.length,
				now = 0,
				self = this;

			if( length == 0 ){
				Popup.setMessage("<p>Visited users: " + self.allUsers + "</p><p>Not following: " + self.notFollowing + "</p><p>Unfollowed: " + self.unfollowedUsers + "</p>");
				Popup.element.closeButton.show();
			}
			else{
				this.notFollowing = length;

				var interval = setInterval(function(){
					if( now < length ){
						notFollowing.eq(now).click();
						now++;
						self.unfollowedUsers++;
						Popup.setMessage("<p>Visited users: " + self.allUsers + "</p><p>Not following: " + self.notFollowing + "</p><p>Unfollowed: " + self.unfollowedUsers + "</p>");
					}
					else{
						clearInterval(interval);
						Popup.element.closeButton.show();
					}
				}, 400);
			}
		},
		interrupt: function(){
			clearInterval(this.interval);
			Popup.element.interrupt.hide();
			this.removeThemAll();
		}
	};

	if( confirm("Are you sure?") ){

		Unfollower.scrollCount = parseInt(prompt("Enter scroll count"));

		Unfollower.process(Popup);
	}

})(document, jQuery);