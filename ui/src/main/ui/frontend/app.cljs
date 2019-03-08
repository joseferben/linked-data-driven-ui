(ns ui.frontend.app
  (:require [reagent.core :as r]))


(defn app []
  [:div "Hello World"])

(defn stop []
  (js/console.log "Stopping..."))

(defn start []
  (js/console.log "Starting...")
  (r/render [app]
            (.getElementById js/document "app")))

(defn ^:export init []
  (start))
