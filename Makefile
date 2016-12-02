BUILD_DIR = build
CLEANCSS = ./node_modules/.bin/cleancss
DEPLOY_DIR = libs
LIBJITSIMEET_DIR = node_modules/lib-jitsi-meet/
NODE_SASS = ./node_modules/.bin/node-sass
NPM = npm
OUTPUT_DIR = .
STYLES_BUNDLE = css/all.bundle.css
STYLES_DESTINATION = css/all.css
STYLES_MAIN = css/main.scss
STYLES_UNSUPPORTED_BROWSER = css/unsupported_browser.scss
WEBPACK = ./node_modules/.bin/webpack

all: update-deps compile deploy clean

all-dev: compile-dev deploy clean

# FIXME: there is a problem with node-sass not correctly installed (compiled)
# a quick fix to make sure it is installed on every update
# the problem appears on linux and not on macosx
update-deps:
	$(NPM) update && $(NPM) install node-sass

compile:
	$(WEBPACK) -p

compile-dev:
	$(WEBPACK)

clean:
	rm -fr $(BUILD_DIR)

deploy: deploy-init deploy-appbundle deploy-lib-jitsi-meet deploy-css deploy-local

deploy-init:
	mkdir -p $(DEPLOY_DIR)

deploy-appbundle:
	cp \
		$(BUILD_DIR)/app.bundle.js \
		$(BUILD_DIR)/app.bundle.map \
		$(BUILD_DIR)/external_api.js \
		$(BUILD_DIR)/external_api.map \
		$(OUTPUT_DIR)/analytics.js \
		$(DEPLOY_DIR)

deploy-lib-jitsi-meet:
	cp \
		$(LIBJITSIMEET_DIR)/lib-jitsi-meet.min.js \
		$(LIBJITSIMEET_DIR)/lib-jitsi-meet.min.map \
		$(LIBJITSIMEET_DIR)/connection_optimization/external_connect.js \
		$(DEPLOY_DIR)

deploy-css:
	$(NODE_SASS) css/unsupported_browser.scss css/unsupported_browser.css ; \
	$(NODE_SASS) $(STYLES_MAIN) $(STYLES_BUNDLE) && \
	$(CLEANCSS) $(STYLES_BUNDLE) > $(STYLES_DESTINATION) ; \
	rm $(STYLES_BUNDLE)

deploy-local:
	([ ! -x deploy-local.sh ] || ./deploy-local.sh)

source-package:
	mkdir -p source_package/jitsi-meet/css && \
	cp -r *.js *.html connection_optimization favicon.ico fonts images libs sounds LICENSE lang source_package/jitsi-meet && \
	cp css/all.css source_package/jitsi-meet/css && \
	cp css/unsupported_browser.css source_package/jitsi-meet/css && \
	(cd source_package ; tar cjf ../jitsi-meet.tar.bz2 jitsi-meet) && \
	rm -rf source_package
