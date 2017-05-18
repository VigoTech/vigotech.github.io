#!/bin/bash

VERSION=${1:-1.8.1}
OS=${2:-linux}
ARCH=${3:-amd64}

if ! type "go" > /dev/null; then
    echo -e "\nINSTALLING GO\n"
    wget https://storage.googleapis.com/golang/go$VERSION.$OS-$ARCH.tar.gz
    sudo tar -C /usr/local -xzf go$VERSION.$OS-$ARCH.tar.gz
    rm go$VERSION.$OS-$ARCH.tar.gz
    sudo echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
    sudo echo 'export GOPATH=$(go env GOPATH)' >> ~/.bashrc
    mkdir -p ~/go/src ~/go/bin ~/go/pkg
fi

echo -e "\nTESTING INSTALLATION\n"
GOPATH=$(go env GOPATH)
mkdir -p $GOPATH/src/hello
cd $GOPATH/src/hello
echo -e "package main\nimport \"fmt\"\nfunc main() {\n\tfmt.Printf(\"hello, go\")\n}" >> hello.go
go build
./hello
echo -e "\n"

cd ~

echo -e "\nINSTALLING DEPENDENCIES\n"
go get -u github.com/tidwall/gjson
go get -u github.com/spf13/hugo


