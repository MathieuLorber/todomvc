#!/usr/bin/env ruby

# frameworks and path definitions
$fmks = Hash.new
$fmks['angularjs'] = 'architecture-examples/angularjs/index.html'
$fmks['angularjs-perf'] = 'architecture-examples/angularjs-perf/index.html'
$fmks['backbone'] = 'architecture-examples/backbone/index.html'
$fmks['dart'] = 'architecture-examples/dart/web/index.html'
$fmks['emberjs'] = 'architecture-examples/emberjs/index.html'
$fmks['gwt'] = 'architecture-examples/gwt/index.html'
$fmks['jquery'] = 'architecture-examples/jquery/index.html'
$fmks['knockoutjs'] = 'architecture-examples/knockoutjs/index.html'
$fmks['spine'] = 'architecture-examples/spine/index.html'
$fmks['vanillajs'] = 'vanilla-examples/vanillajs/index.html'

# verbose and/or debug ?
$verbose = false
$debug = false
ARGV.each do |arg|
  if arg.start_with?('-')
    if arg.include?('d')
      $debug = true
    end
    if arg.include?('v')
      $verbose = true
    end
  end
end

# first line of the results table
if !$verbose
  printf '%-15s| ' % ' '
  printf '%-10s| ' % 'test'
  # TODO come back soon !
  #['count', 'edit', 'history', 'storage'].each do |test|
  #  printf '%-10s| ' % test
  #end
  print "\n"
end

# def green OK
def printOk()
  print "\033[32m"
  printf '%-10s' % 'OK'
  print "\033[0m| "
end

# def red KO
def printKo()
  print "\033[31m"
  printf '%-10s' % 'KO'
  print "\033[0m| "
end

# def main unit call
$setCasper = "if [ -z ${casperjs} ]; then export casperjs=casperjs; fi"
def casper(fmk)
  # TODO check ko due to false dir is obvious
  #File.exist?(fmkFunctions)
  cmd = "#{$setCasper};$casperjs"
  cmd << " --includes=tests/init.js"
  fmkFunctions = "tests/functions/#{fmk}.js"
  if File.exist?(fmkFunctions)
    cmd << "," + fmkFunctions
  end
  cmd << ",tests/functions.js"
  cmd << ",tests/assertions.js"
  cmd << " test tests/test.js"
  cmd << " --url=#{$fmks[fmk]} --fmk=#{fmk}"
  if $debug
    cmd << " --debug=true"    
  end
  if $verbose
    cmd << " | tee tests/results/" + fmk + ".log"
    system(cmd)
  else
    cmd << " > tests/results/" + fmk + ".log"
    printf '%14s | ' % fmk
    system(cmd) ? printOk : printKo
    print "\n"
  end 
end

# create the results & results/imgs directories if they don't exist
system("mkdir -p tests/results/imgs")

# launch test for each framework found in args, or for all
testAllFmks = true
ARGV.each do |arg|
  if $fmks.keys.include?(arg)
    casper(arg)
    testAllFmks = false
  end
end
if testAllFmks
  $fmks.keys.each do |fmk|
    casper(fmk)
  end
end
