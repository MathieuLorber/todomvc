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

# verbose output !
$verbose = false
ARGV.each do |arg|
  if arg == '-v'
    $verbose = true
  end
end

# first line of the results table
if !$verbose
  printf '%-15s| ' % ' '
  ['count', 'edit', 'history', 'storage'].each do |test|
    printf '%-10s| ' % test
  end
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
  # TODO option to enable casperjs output instead of table
  #print "#{$setCasper};$casperjs tests/#{test}.js #{fmks[fmk]} > /dev/null"
  #print "\n"
  cmd = "#{$setCasper};$casperjs"
  fmkFunctions = "tests/functions/#{fmk}.js"
  if File.exist?(fmkFunctions)
    cmd << " --includes=" + fmkFunctions
  end
  cmd << " --includes=tests/init.js "
  cmd << " test tests/test.js "
  cmd << " --url=#{$fmks[fmk]} --fmk=#{fmk}"
  if $verbose
    cmd << " --output=bash"
    system(cmd)
  else
    cmd << " --output=html > tests/results/#{fmk}.html"
    printf '%14s | ' % fmk
    system(cmd) ? printOk : printKo
    print "\n"
  end 
end

# create the results dir if it doesn't exist
system("mkdir -p tests/results")

# launch test for each framework found in args, or for all
testAllFmks = true
ARGV.each do |arg|
  if $fmks.keys.include?(arg)
    casper(arg)
    testAllFmks = false
  end
end
if testAllFmks
  $fmks.each do |fmk|
    casper(fmk)
  end
end
