(ns ui.frontend.app
  (:require [reagent.core :as r]
            [shadow.resource :as rc]
            [ui.frontend.core.components :refer [play-ground]]
            [ui.frontend.core.db :as db]
            [ui.frontend.core.renderer :refer [render]]))

(defn init! []
  (.pushState (.-history js/window) {} "" "playground")
  (db/init-db! (rc/inline "./use-cases.json"))
  (db/register-renderer! :default render))

(defn app []
  [:div [play-ground render]])

(defn stop []
  (js/console.log "Stopping..."))

(defn start []
  (js/console.log "Starting...")
  (init!)
  (r/render [app] (.getElementById js/document "app")))

(defn ^:export init []
  (start))
