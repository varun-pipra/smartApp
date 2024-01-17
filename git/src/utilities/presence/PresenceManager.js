class PresenceManager {
	constructor(config) {
        let that=this;
		if (config && config.domElementId && config.initialconfig) {
			that.start(config.domElementId,config.initialconfig);
		}
	}
    start = (domElementId, initialconfig) => {
        var that=this,
        domChecker=document.getElementById(domElementId);
        if(!domChecker){
            setTimeout(function(){
                that.start(domElementId, initialconfig);
            },500);
            return;
        }
        if (!Element.prototype.trigger)
        {
            Element.prototype.trigger = function(eventName,data,byPass,cEvent)
            {	if(eventName === "presenceuserhover" && !byPass){
                    var target=window.event.target,mainTarget=this,cEvent=window.event;
                    var timer = setTimeout( function() {mainTarget.trigger('presenceuserhover',data,true,cEvent);}, 500);
                    target.addEventListener('mouseleave',function(){
                        clearTimeout(timer);
                    })
                }else{
                    var ev;
    
                    try
                    {
                        if (this.dispatchEvent && CustomEvent)
                        {
                            ev = new CustomEvent(eventName, {detail : eventName + ' fired!'});
                            if(data){
                                ev.data=data;
                            }
                            ev.event=window.event || cEvent;
                            this.dispatchEvent(ev);
                        }
                        else
                        {
                            throw "CustomEvent Not supported";
                        }
                    }
                    catch(e)
                    {
                        if (document.createEvent)
                        {
                            ev = document.createEvent('HTMLEvents');
                            if(data){
                                ev.data=data;
                            }
                            ev.event=window.event || cEvent;
                            ev.initEvent(eventName, true, true);
    
                            this.dispatchEvent(eventName);
                        }
                        else
                        {
                            ev = document.createEventObject();
                            if(data){
                                ev.data=data;
                            }
                            ev.event=window.event || cEvent;
                            ev.eventType = eventName;
                            this.fireEvent('on'+ev.eventType, eventName);
                        }
                    }
                }
            }
        }
        var mainDiv=document.createElement("div");
        var mainDivId="common-participant-control_"+domElementId+"_"+new Date().getTime();
            mainDiv.setAttribute("id",mainDivId);
            mainDiv.setAttribute("class","common-participant-control");
            var html="",selfData={},participants=[],maxUser=3;
            if(initialconfig && initialconfig.maxUser){
                maxUser=initialconfig.maxUser || maxUser;
            };
			if(initialconfig && initialconfig.showBrena){
                html+= '<div class="cell brenabtn-main" data-qtip="BrenaAI"><div class="brenabtn-wrapper tooltip"><span class="badgecount"></span><span class="tooltiptext">Brena AI</span><div class="brenabtn"></div></div></div>';
            }
            if(initialconfig && initialconfig.showLiveSupport){
                html+= '<div class="cell livesupportbtn-main" data-qtip="LiveSupport"><div class="livesupportbtn-wrapper tooltip"><span class="badgecount"></span><span class="tooltiptext">Help</span><div class="livesupportbtn"></div></div></div>';
            }
            
            if(initialconfig && initialconfig.showLiveLink){
                html+= '<div class="cell livelinkbtn-main" data-qtip="LiveLink"><div class="livelinkbtn-wrapper tooltip"><span class="badgecount"></span><span class="tooltiptext">LiveLink</span><div class="livelinkbtn"></div></div></div>';
            }
            if(initialconfig && initialconfig.showPrint){
                html+='<div class="cell printbutton-main" data-qtip="Print"><div class="print-button-wrapper tooltip"><span class="badgecount"></span><span class="tooltiptext">Print</span><div class="printbutton"></div></div></div>';
            }
            if(initialconfig && initialconfig.showStreams){
                html+='<div class="cell streambutton-main" data-qtip="Stream"><div class="streambutton-wrapper tooltip"><span class="badgecount"></span><span class="tooltiptext">Stream</span><div class="streambutton"></div></div></div>';
            }
    
            if(initialconfig && initialconfig.showComments){
                html+='<div class="cell commentbutton-main" data-qtip="Comment"><div class="commentbutton-wrapper tooltip"><span class="badgecount"></span><span class="tooltiptext">Comment</span><div class="commentbutton"></div></div></div>';
            }
    
             html+='<div class="cell collboratortray-wrapper"><div class="collboratortray">';
            
            if(initialconfig && initialconfig.participants){
                var participantsUsers=initialconfig.participants;
                participants=[];//dont include self
                for(var i=0;i<participantsUsers.length;i++){
                    if(participantsUsers[i]["self"]){
                        selfData=participantsUsers[i];
                    }else{
                        participants.push(participantsUsers[i]);
                    }
                }
                var maxlength= (participants.length > maxUser) ? maxUser : (participants.length);
                var nonFirst=true;
                for(var i=0;i<maxlength;i++){
                    var cls="non-first";
                       if(nonFirst){
                        cls="";
                    }
                    nonFirst=false;
                    if(participants[i].profile){
                        html+='<div class="collaborator-box '+cls+'" data-qtip="'+(participants[i]["name"])+'" onclick="document.getElementById(\'' + mainDivId + '\').trigger(\'presenceuserclick\',\''+participants[i]["userid"]+'\');" onmouseover="document.getElementById(\'' + mainDivId + '\').trigger(\'presenceuserhover\',\''+participants[i]["userid"]+'\');"><div  class="collaborator-image tooltip" style="background-image:url('+participants[i].profile+');border:2px solid '+participants[i]["color"]+'"></div></div>';
                    }else{
                        html+='<div class="collaborator-box '+cls+'" data-qtip="'+(participants[i]["name"])+'" onclick="document.getElementById(\'' + mainDivId + '\').trigger(\'presenceuserclick\',\''+participants[i]["userid"]+'\');" onmouseover="document.getElementById(\'' + mainDivId + '\').trigger(\'presenceuserhover\',\''+participants[i]["userid"]+'\');"><div  class="collaborator-image tooltip" style="border:2px solid '+participants[i]["color"]+'"><span class="text">'+(participants[i]["name"]).charAt(0)+'</span></div></div>';
                    }
                }
                if(participants.length > maxUser){
                    html+='<div class="collaborator-participant-count" onclick="document.getElementById(\'' + mainDivId + '\').trigger(\'presencecountclick\');">+'+(participants.length - maxUser)+'</div>';
                }
            }
            html+='</div></div>';
    
            if(initialconfig && initialconfig.showChat){
                if((initialconfig.participants  && (initialconfig.participants).length == 1)){
                    html+='<div class="cell chatbutton-main" style="display:none;" data-qtip="Chat"><div class="chatbutton-wrapper tooltip"><span class="badgecount"></span><span class="tooltiptext">Chat</span><div class="chatbutton"></div></div></div>';
                }else{
                    html+='<div class="cell chatbutton-main" data-qtip="Chat"><div class="chatbutton-wrapper tooltip"><span class="badgecount"></span><span class="tooltiptext">Chat</span><div class="chatbutton"></div></div></div>';
                }
            }
    
            if(selfData && !(initialconfig.hideProfile)){
                html+='<div class="cell collboratortrayself-prewrapper"></div>';
                html+='<div class="cell collboratortrayself-wrapper" data-qtip="'+(selfData["name"])+'"><div class="collboratortray-self">';
                if(selfData.profile){
                    html+='<div class="collaborator-box"><div  class="collaborator-image tooltip" style="background-image:url('+selfData.profile+');border:2px solid #d5d1d1"><span class="tooltiptext">'+(selfData["name"])+'</span></div></div>';
                }else if(selfData["name"]){
                    html+='<div class="collaborator-box"><div  class="collaborator-image tooltip" style="border:2px solid #d5d1d1"><span class="text">'+(selfData["name"]).charAt(0)+'<span><span class="tooltiptext">'+(selfData["name"])+'</span></div></div>';
                }
                html+='</div></div>';
            }
    
        mainDiv.innerHTML=html;
        mainDiv.initialconfig=initialconfig;
        mainDiv.participants=participants;
        mainDiv.selfData=selfData;
        mainDiv.setButtonBadge=function(buttonName,count,animation){
            var mainControl=document.getElementById(mainDivId);
            if(!mainControl){
                // console.log('this instance already destroyed');
                return;
            }
            var currentbtn=null;
            if(!buttonName){
                return;
            }
            var countHtml= count > 99 ? "99+" : count;
            switch(buttonName.trim()){
                case "livesupport":
                    var livesupportbtn=mainControl.getElementsByClassName("livesupportbtn-wrapper")[0];
                    currentbtn=livesupportbtn.getElementsByClassName("badgecount")[0];
                    currentbtn.innerHTML=countHtml;
                    break;
                case "livelink":
                    var livelinkbtn=mainControl.getElementsByClassName("livelinkbtn-wrapper")[0];
                    currentbtn=livelinkbtn.getElementsByClassName("badgecount")[0];
                    currentbtn.innerHTML=countHtml;
                    break;
                case "stream":
                    var streambutton=mainControl.getElementsByClassName("streambutton-wrapper")[0];
                    currentbtn=streambutton.getElementsByClassName("badgecount")[0];
                    currentbtn.innerHTML=countHtml;
                    if(count > 99){
                        currentbtn.setAttribute("style", "display:none;");
                    }
                    break;
                case "comment":
                    var commentbutton=mainControl.getElementsByClassName("commentbutton-wrapper")[0];
                    currentbtn=commentbutton.getElementsByClassName("badgecount")[0];
                    currentbtn.innerHTML=countHtml;
                    if(animation){
                        commentbutton.classList.add("newcommentmessage");
                    }else{
                        commentbutton.classList.remove("newcommentmessage");
                    }
                    break;
                case "chat":
                    var chatbutton=mainControl.getElementsByClassName("chatbutton-wrapper")[0];
                    if(count > 0){
                        chatbutton.classList.add("newchatmessage");
                    }else{
                        chatbutton.classList.remove("newchatmessage");
                    }
                    currentbtn=chatbutton.getElementsByClassName("badgecount")[0];
                    currentbtn.innerHTML=countHtml;
                    break;
            }
            if(count > 0 && currentbtn){
                currentbtn.setAttribute("style", "display:block;");
            }else if(currentbtn){
                currentbtn.setAttribute("style", "display:none;");
            }
        };
        mainDiv.setButtonAnimation = function (buttonName, animation) {
            let mainControl = document.getElementById(mainDivId);
            animation = !!animation;
            if (!buttonName) {
                return;
            }
            switch (buttonName.trim()) {
                case "comment":
                    {
                        let commentbutton = mainControl.getElementsByClassName("commentbutton-wrapper")[0];
                        if (animation) {
                            commentbutton.classList.add("newcommentmessage");
                        } else {
                            commentbutton.classList.remove("newcommentmessage");
                        }
                    }
                    break;
                case "chat":
                    {
                        let chatbutton = mainControl.getElementsByClassName("chatbutton-wrapper")[0];
                        if (animation) {
                            chatbutton.classList.add("newchatmessage");
                        } else {
                            chatbutton.classList.remove("newchatmessage");
                        }
                    }
                    break;
                case "livelink":
                    {
                        let livelinkbutton = mainControl.getElementsByClassName("livelinkbtn-wrapper")[0];
                        if (animation) {
                            livelinkbutton.classList.add("animated");
                        } else {
                            livelinkbutton.classList.remove("animated");
                        }
                    }
                    break;
            }
        };
        mainDiv.updateParticipants=function(participants){
            if(participants){
                var selfData={};
                var participantsUsers=participants;
                var participants=[];//dont include self
                for(var i=0;i<participantsUsers.length;i++){
                    if(participantsUsers[i]["self"]){
                        selfData=participantsUsers[i];
                    }else{
                        participants.push(participantsUsers[i]);
                    }
                }
                var maxlength= (participants.length > maxUser) ? maxUser : (participants.length);
                var html="";
                var nonFirst=true;
                for(var i=0;i<maxlength;i++){
                    var cls="non-first";
                       if(nonFirst){
                        cls="";
                    }
                    nonFirst=false;
                    if(participants[i].profile){
                        html+='<div class="collaborator-box '+cls+'" data-qtip="'+(participants[i]["name"])+'" onclick="document.getElementById(\'' + mainDivId + '\').trigger(\'presenceuserclick\',\''+participants[i]["userid"]+'\');" onmouseover="document.getElementById(\'' + mainDivId + '\').trigger(\'presenceuserhover\',\''+participants[i]["userid"]+'\');"><div  class="collaborator-image tooltip" style="background-image:url('+participants[i].profile+');border:2px solid '+participants[i]["color"]+'"></div></div>';
                    }else{
                        html+='<div class="collaborator-box '+cls+'" data-qtip="'+(participants[i]["name"])+'" onclick="document.getElementById(\'' + mainDivId + '\').trigger(\'presenceuserclick\',\''+participants[i]["userid"]+'\');" onmouseover="document.getElementById(\'' + mainDivId + '\').trigger(\'presenceuserhover\',\''+participants[i]["userid"]+'\');"><div  class="collaborator-image tooltip" style="border:2px solid '+participants[i]["color"]+'"><span class="text">'+(participants[i]["name"]).charAt(0)+'</span></div></div>';
                    }
                }
                if(participants.length > maxUser){
                    html+='<div class="collaborator-participant-count" onclick="document.getElementById(\'' + mainDivId + '\').trigger(\'presencecountclick\');">+'+(participants.length - maxUser)+'</div>';
                }
                var mainControl=document.getElementById(mainDivId);
                if(!mainControl){
                    // console.log('this instance already destroyed');
                    return;
                }
                var collboratortraywrapper=mainControl.getElementsByClassName("collboratortray-wrapper")[0];
                var collboratortray=collboratortraywrapper && collboratortraywrapper.getElementsByClassName("collboratortray")[0];
                collboratortray.innerHTML=html;
                mainControl.participants=participants;
                mainControl.selfData=selfData;
                var collboratortrayselfwrapper=mainControl.getElementsByClassName("collboratortrayself-wrapper")[0];
                var collboratorselftray=collboratortrayselfwrapper && collboratortrayselfwrapper.getElementsByClassName("collboratortray-self")[0];
                if(selfData && collboratorselftray){
                    collboratortrayselfwrapper.setAttribute("data-qtip",(selfData["name"]));
                    var selfHtml='';
                    if(selfData.profile){
                        selfHtml+='<div class="collaborator-box"><div  class="collaborator-image tooltip" style="background-image:url('+selfData.profile+');border:2px solid #d5d1d1"><span class="tooltiptext">'+(selfData["name"])+'</span></div></div>';
                    }else if(selfData["name"]){
                        selfHtml+='<div class="collaborator-box"><div  class="collaborator-image tooltip" style="border:2px solid #d5d1d1"><span class="text">'+(selfData["name"]).charAt(0)+'<span><span class="tooltiptext">'+(selfData["name"])+'</span></div></div>';
                    }
                    collboratorselftray.innerHTML=selfHtml;
                }
                if(participants.length === 0){
                    var chatbutton=mainControl.getElementsByClassName("chatbutton-main")[0];
                    chatbutton && chatbutton.setAttribute("style","display:none;");
                }else{
                    var chatbutton=mainControl.getElementsByClassName("chatbutton-main")[0];
                    chatbutton && chatbutton.setAttribute("style","display:table-cell;");
                }
            }
        };
        mainDiv.getParticipants=function(){
            var mainControl=document.getElementById(mainDivId);
            return mainControl.participants;
        };
        mainDiv.getSelfData=function(){
            var mainControl=document.getElementById(mainDivId);
            return mainControl.selfData;
        };
        mainDiv.initialconfig=initialconfig;
        document.getElementById(domElementId).innerHTML="";
        document.getElementById(domElementId).appendChild(mainDiv);
       
        var mainControl=document.getElementById(mainDivId);
        var brenabtn=mainControl.getElementsByClassName("brenabtn-wrapper")[0];
        var livesupportbtn=mainControl.getElementsByClassName("livesupportbtn-wrapper")[0];
        var livelinkbtn=mainControl.getElementsByClassName("livelinkbtn-wrapper")[0];
        var printbutton=mainControl.getElementsByClassName("printbutton-wrapper")[0];
        var streambutton=mainControl.getElementsByClassName("streambutton-wrapper")[0];
        var commentbutton=mainControl.getElementsByClassName("commentbutton-wrapper")[0];
        var chatbutton=mainControl.getElementsByClassName("chatbutton-wrapper")[0];
        var profileButton=mainControl.getElementsByClassName("collboratortrayself-wrapper")[0];
        brenabtn && brenabtn.addEventListener("click",function(){
            mainDiv.trigger('brenabtnclick');
        });
		livesupportbtn && livesupportbtn.addEventListener("click",function(){
            mainDiv.trigger('livesupportbtnclick');
        });
        livelinkbtn && livelinkbtn.addEventListener("click",function(){
            mainDiv.trigger('livelinkbtnclick');
        });
        printbutton && streambutton.addEventListener("click",function(){
            mainDiv.trigger('printbuttonclick');
        });
        streambutton && streambutton.addEventListener("click",function(){
            mainDiv.trigger('streambuttonclick');
        });
        commentbutton && commentbutton.addEventListener("click",function(){
            mainDiv.trigger('commentbuttonclick');
            this.classList.remove("newcommentmessage");
        });
        chatbutton && chatbutton.addEventListener("click",function(){
            mainDiv.setButtonBadge('chat',0);
               mainDiv.trigger('chatbuttonclick');
        });
        profileButton && profileButton.addEventListener("click",function(){
           mainDiv.trigger('profileclick');
        });
        that.control=mainDiv;
        if(!document.PresenceManagerDomListener){
            document.body.addEventListener("click", RespondDomEvent);
            document.body.addEventListener("mousemove", RespondDomEvent);
            document.body.addEventListener("touchstart", RespondDomEvent);
            document.body.addEventListener("touchmove", RespondDomEvent);
            function RespondDomEvent(e) {
                var data = {
                    type: e.type,
                    pageX: e.pageX,
                    pageY: e.pageY
                };
                that.submitToParent && that.submitToParent({ evt: 'domevent',event: 'domevent', data: data });
            }
            document.PresenceManagerDomListener=true;
        }
        
        return mainDiv;
    }
    submitToParent = (data) => {
        var iFrameDetection = (window === window.parent) ? false : true;
        iFrameDetection && window.parent && window.parent.postMessage && window.parent.postMessage(data, '*');
    }
}
export default PresenceManager;