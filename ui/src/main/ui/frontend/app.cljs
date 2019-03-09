(ns ui.frontend.app
  (:require [reagent.core :as r]
            [shadow.resource :as rc]
            [ui.frontend.core.components :refer [play-ground]]
            [ui.frontend.core.state :as s]
            [ui.frontend.core.renderer :refer [render]]))

(defn init! []
  (.pushState (.-history js/window) {} "" "playground")
  (s/register-renderer :default render))

(defn app []
  [:div [play-ground
         render
         (js->clj (.parse js/JSON (rc/inline "./use-cases.json")) :keywordize-keys true)]])

(defn stop []
  (js/console.log "Stopping..."))

(defn start []
  (js/console.log "Starting...")
  (init!)
  (r/render [app]
            (.getElementById js/document "app")))

(defn ^:export init []
  (start))
