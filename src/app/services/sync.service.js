"use strict";

angular.module("mopify.services.sync", [
    'LocalStorageModule'
])

.factory("Sync", function SyncFactory($http, $q, localStorageService){
    
   /* var apiUrl = "/mopify-sync/"; */
    var apiUrl = "http://localhost:6680/mopify-sync/";

    /**
     * Do a get request to the sync server
     * @param  {string} url  
     * @param  {object} data 
     */
    var post = function(url, data) {
        var deferred = $q.defer();
        var postdata = (data !== undefined) ? data : {};

        $http({
            method: 'POST',
            url: apiUrl + url,
            params: postdata
        }).success(function(result) {
            deferred.resolve(result.response);
        });

        return deferred.promise;
    };

    /**
     * Do a get request to the sync server
     * @param  {string} url  
     * @param  {object} data 
     */
    var get = function(url, data){
        var deferred = $q.defer();
        var postdata = (data !== undefined) ? data : {};

        $http({
            method: 'GET',
            url: apiUrl + url,
            params: postdata
        }).success(function(result) {
            deferred.resolve(result.response);
        });

        return deferred.promise;
    };

    function Sync(){
        var client = localStorageService.get("syncclient");

        // Check if the client already exists in localstorage
        if(client === null){
            var clientid = (Date.now() * Math.floor(Math.random() * 50));

            this.client = {
                id: clientid
            };

            localStorageService.set("syncclient", this.client);

            // Register the client
            this.registerClient();
        }
        else{
            this.client = client;
        }
    }

    /**
     * Register the client
     */
    Sync.prototype.registerClient = function() {
        return post("clients", {
            client_id: this.client.id
        });
    };

    /**
     * Get a client list
     */
    Sync.prototype.listClients = function(){
        return get("clients");
    };

    /**
     * Get the Spotify tokens
     */
    Sync.prototype.getSpotify = function(){
        return get("spotify");
    };

    /**
     * Get the Spotify tokens
     * @param {object} data data to save
     */
    Sync.prototype.setSpotify = function(data){
        data.client_id = this.client.id;
        return post("spotify", data);
    };

    return new Sync();

});