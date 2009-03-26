#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'

get '/test' do
  "Hello cross domain world!"
end

get '/ping.gjs' do
  content_type 'application/x-gears-worker'
  File.read('ping.gjs')
end
