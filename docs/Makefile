SPHINXBUILD	= sphinx-build
SOURCEDIR	= .
BUILDDIR	= build

RU_SOURCEDIR	= ru/source
RU_BUILDDIR	= build/ru

CH_SOURCEDIR	= ch/source
CH_BUILDDIR	= build/ch

EN_SOURCEDIR	= en/source
EN_BUILDDIR	= build/en

.PHONY: help Makefile

html: ru en ch

all: clean ru en ch

test: clean ru

ru: .ru_build
	@echo "Russian build completed"

ch: .ch_build
	@echo "Chinese build completed"

en: .en_build
	@echo "English build completed"

.ru_build:
	$(SPHINXBUILD) -M html "$(RU_SOURCEDIR)" "$(RU_BUILDDIR)" -c .
	cp -r $(RU_BUILDDIR)/html/* $(RU_BUILDDIR)/
	rm -rf $(RU_BUILDDIR)/html
	@touch $@

.ch_build:
	$(SPHINXBUILD) -M html "$(CH_SOURCEDIR)" "$(CH_BUILDDIR)" -c .
	cp -r $(CH_BUILDDIR)/html/* $(CH_BUILDDIR)/
	rm -rf $(CH_BUILDDIR)/html
	@touch $@

.en_build:
	$(SPHINXBUILD) -M html "$(EN_SOURCEDIR)" "$(EN_BUILDDIR)" -c .
	cp -r $(EN_BUILDDIR)/html/* $(EN_BUILDDIR)/
	rm -rf $(EN_BUILDDIR)/html
	@touch $@

clean:
	-rm -rf $(BUILDDIR)/*
	-rm .ru_build .en_build .ch_build
