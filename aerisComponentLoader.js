function loadJsFromGithub(path) {
	//toto/tutu@version
	if (path) {
		var aux = path.split("/");
		var account = aux[0]
		var repo=aux
		var version = null
		var sha=null
		if (aux[1].indexOf('@') >0) {
			var aux = aux[1].split('@')
				repo = aux[0]
				version=aux[1]
		}
		if (version) {
			console.log("Account: "+account)
			console.log("Repo: "+repo)
			console.log("Version: "+version)
			if (version.toLowerCase() == "latest") {
				console.log(getLatestUrl(account, repo))
			} else {
				console.log(getVersionUrl(account, repo, version))
			}
		}
	}
}



function getLatestUrl(account, repo) {
	
	var url = "https://sedoo.aeris-data.fr/aeris-rest-services/rest/jsloading/versions?component="+repo+"&fakeparam="+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10)
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var json = JSON.parse(request.responseText);
	    var latestRelease = json[0];
		var sha =latestRelease.commit.sha;
		var version = latestRelease.name;
		var rawGitUrl = getRawgitUrl(account, repo, sha, version)
		console.log(rawGitUrl)
		var scriptTag = document.createElement('script');
		scriptTag.setAttribute('src',rawGitUrl);
		document.head.appendChild(scriptTag);
	  } else {
	    console.log("Problem with getLatestUrl "+url)

	  }
	};

	request.onerror = function() {
		console.log("Problem with getLatestUrl "+url)
	};

	request.send();
}

function getVersionUrl(account, repo,version) {
	var url = "https://sedoo.aeris-data.fr/aeris-rest-services/rest/jsloading/versions?component="+repo+"&fakeparam="+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10)
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var json = JSON.parse(request.responseText);
	    var latestRelease = null;
	    var arrayLength = json.length;
	    for (var i = 0; i < arrayLength; i++) {
	        if (json[i].name == version) {
	        	latestRelease = json[i]
	        }
	    }
	    
		var sha =latestRelease.commit.sha;
		var rawGitUrl = getRawgitUrl(account, repo, sha, version)
		console.log(rawGitUrl)
		var scriptTag = document.createElement('script');
		scriptTag.setAttribute('src',rawGitUrl);
		document.head.appendChild(scriptTag);
	  } else {
	    console.log("Problem with getLatestUrl "+url)

	  }
	};

	request.onerror = function() {
		console.log("Problem with getLatestUrl "+url)
	};

	request.send();
}

function getRawgitUrl(account, repo, sha, version) {
	return "https://cdn.rawgit.com/"+account+"/"+repo+"/"+sha+"/dist/"+repo+"_"+version+".js"
}

var component = document.currentScript.getAttribute('component')
if (component) {
	loadJsFromGithub(component)
}