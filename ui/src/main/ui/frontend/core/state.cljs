(ns ui.frontend.core.state
  (:require [reagent.core :as r]))

(defonce app-state (r/atom {}))

(defn store! [string]
  (try (swap! app-state assoc :data (js->clj (.parse js/JSON string) :keywordize-keys true))
       (js/console.log (str "Updated state with valid json"))
       (catch :default e
         (js/console.warn "Invalid JSON provided, skipping state update"))))

(defn fetch! []
  (clj->js (:data @app-state)))

(defn register-renderer [k renderer]
  (swap! app-state assoc-in [:renderers k] renderer))
