#!/usr/bin/env bash

source vendor/is_installed/is_installed.sh

echo "node                  $(echo_if $(program_is_installed node))"
echo "npm                   $(echo_if $(program_is_installed npm))"
echo "nw                    $(echo_if $(program_is_installed nw))"
echo "nw-builder            $(echo_if $(program_is_installed nw-builder))"
echo "grunt                 $(echo_if $(program_is_installed grunt))"
echo "grunt-nw-builder      $(echo_if $(program_is_installed grunt-nw-builder))"
echo "less                  $(echo_if $(program_is_installed less))"
