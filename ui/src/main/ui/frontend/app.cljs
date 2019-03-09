(ns ui.frontend.app
  (:require [reagent.core :as r]
            [shadow.resource :as rc]
            [ui.frontend.core.components :refer [play-ground]]
            [ui.frontend.core.state :refer [data-state]]
            [ui.frontend.core.renderer :refer [render]]))

(defonce renderers (atom {:default render}))

(defn init! []
  (let [use-cases (.parse js/JSON (rc/inline "./use-cases.json"))]
    (.pushState (.-history js/window) {} "" "playground")
    (swap! data-state assoc :data use-cases)))

(defn app []
  [:div [play-ground (:default @renderers)]])

(defn stop []
  (js/console.log "Stopping..."))

(defn start []
  (js/console.log "Starting...")
  (init!)
  (r/render [app]
            (.getElementById js/document "app")))

(defn ^:export init []
  (start))
