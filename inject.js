async function run_attack(eth_address,num_of_attack){
	var remaining = true;
	eth_address = eth_address.toLowerCase();

	var barer = window.localStorage['axieinfinity.'+eth_address+'.auth'];
	if(eth_address == ""){
		alert("Please enter your ETH address.");
		return;
	}
	if(typeof(barer) == 'undefined' && barer == null){
		alert("No authentication token found. Please make sure your are on axieinfinity.com and sign your address at battle page!");
		return;
	}
	var remaining = true;
	var limit = 100;
	var offset = 0;
	var team_list = [];
	while(remaining){
		var result_json = await fetch('https://api.axieinfinity.com/v1/battle/teams/?address='+eth_address+'&offset='+offset+'&count='+limit+'&no_limit=1')
		  .then(res => res.json());
		team_list = team_list.concat(result_json.teams);
		console.log(result_json.teams.length);
		console.log(team_list.length);
		offset += limit;
		if(result_json.teams.length < limit){
			remaining = false;
		}
	}
	team_list.forEach(async function(team,index){
		for(var i =0; i < num_of_attack; i ++){
			await fetch('https://api.axieinfinity.com/v1/battle/battle/queue', {
				method: 'POST',
				headers: {
				  'Authorization': 'Bearer '+barer,
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify({"teamId":team.teamId})
			}).then(rawResponse=>console.log(rawResponse.text()));
		}
		if (index === team_list.length - 1){ 
			//last team
			alert(team_list.length+ " team(s) are queued succesfully! You can close/move away from the window.");
		}
	});
	alert(team_list.length+ " team(s) sent to battle "+num_of_attack+" time(s) each! Please wait a while on current axieinfinity.com page to make sure all the teams are queued succesfully.");
	 
}
