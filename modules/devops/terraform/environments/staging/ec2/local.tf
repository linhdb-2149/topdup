locals {
  install_nomad_docker = <<-USERDATA
    #!/bin/bash
    set +x
    # install nomad
    curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add - 
    sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
    sudo apt-get update && sudo apt-get install nomad

    # install docker
    cd ~
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker ubuntu
  USERDATA
}
