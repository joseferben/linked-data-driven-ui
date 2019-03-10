(ns ui.frontend.core.db
  (:require [reagent.core :as r]))

(defonce data-to-render (r/atom {}))

(defonce state (r/atom {:use-cases {}
                        :selected-use-case-key :home-automation
                        :renderers {:default nil}
                        :selected-renderer-key :default}))

(defn init-db! [use-cases]
  (try (swap! state assoc :use-cases (js->clj (.parse js/JSON use-cases) :keywordize-keys true))
       (reset! data-to-render (get-in @state [:use-cases (:selected-use-case-key @state)]))
       (js/console.log (str "Initialized database"))
       (catch :default e
         (js/console.warn "Invalid JSON provided, skipping state update"))))

(defn store-data-to-render! [to-store]
  (try (reset! data-to-render (js->clj (.parse js/JSON to-store) :keywordize-keys true))
       (js/console.log (str "Stored data to be rendered"))
       (catch :default e
         (js/console.warn "Invalid JSON provided, skipping state update"))))

(defn fetch-selected-use-case []
  (clj->js (get-in @state [:use-cases (:selected-use-case-key @state) :data])))

(defn fetch-data-to-render []
  (clj->js @data-to-render))

(defn register-renderer! [k renderer]
  (swap! state assoc-in [:renderers k] renderer))
