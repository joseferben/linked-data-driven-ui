(ns ui.frontend.app
  (:require [reagent.core :as r]
            [ui.frontend.core.components :refer [play-ground]]))

(defn app []
  (.pushState (.-history js/window) {} "" "playground")
  [:div [play-ground]])

(defn stop []
  (js/console.log "Stopping..."))

(defn start []
  (js/console.log "Starting...")
  (r/render [app]
            (.getElementById js/document "app")))

(defn ^:export init []
  (start))
